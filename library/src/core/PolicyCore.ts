import {
  AWSResource,
  IAMPolicy,
  PolicyStatement,
  ARNItem,
  ValidationResult,
  Selection,
} from '../types';

export class PolicyCore {
  private resources: Map<string, AWSResource> = new Map();

  private selections: Map<string, Selection> = new Map();

  private arnList: ARNItem[] = [];

  private dependencies: Map<string, string[]> = new Map();

  constructor() {
    this.reset();
  }

  addResource(resource: AWSResource): void {
    this.resources.set(resource.id, resource);
    if (!this.selections.has(resource.id)) {
      this.selections.set(resource.id, {
        resourceId: resource.id,
        actions: [],
        arn: undefined,
      });
    }
  }

  removeResource(resourceId: string): void {
    this.resources.delete(resourceId);
    this.selections.delete(resourceId);
  }

  setActions(resourceId: string, actions: string[]): void {
    const selection = this.selections.get(resourceId);
    if (selection) {
      selection.actions = [...new Set(actions)];
    }
  }

  setARN(resourceId: string, arn: string): void {
    const selection = this.selections.get(resourceId);
    if (selection) {
      selection.arn = arn;
    }
  }

  setARNList(arns: ARNItem[]): void {
    this.arnList = arns;
  }

  getFilteredARNs(service: string, resourceType?: string): ARNItem[] {
    return this.arnList.filter((item) => {
      const serviceMatch = item.service === service;
      if (!resourceType) return serviceMatch;
      return serviceMatch && item.resourceType === resourceType;
    });
  }

  setDependencyResolver(resolver: (actions: string[]) => string[]): void {
    this.dependencyResolver = resolver;
  }

  private dependencyResolver?: (actions: string[]) => string[];

  resolveDependencies(actions: string[]): string[] {
    if (this.dependencyResolver) {
      return this.dependencyResolver(actions);
    }
    
    const resolved = new Set<string>(actions);
    actions.forEach((action) => {
      const deps = this.dependencies.get(action);
      if (deps) {
        deps.forEach((dep) => resolved.add(dep));
      }
    });

    return Array.from(resolved);
  }

  validateARN(service: string, arn: string): ValidationResult {
    if (!arn) {
      return { valid: false, message: 'ARN is required' };
    }

    const arnPattern = /^arn:aws:[a-z0-9-]+:[a-z0-9-]*:[0-9]*:.*$/;
    if (!arnPattern.test(arn)) {
      return {
        valid: false,
        message: 'Invalid ARN format',
        suggestions: [`arn:aws:${service}:region:account-id:resource`],
      };
    }

    const arnService = arn.split(':')[2];
    if (arnService !== service) {
      return {
        valid: false,
        message: `ARN service mismatch. Expected ${service}, got ${arnService}`,
      };
    }

    return { valid: true };
  }

  generatePolicy(): IAMPolicy {
    const statements: PolicyStatement[] = [];
    const statementMap = new Map<string, PolicyStatement>();

    this.selections.forEach((selection) => {
      if (selection.actions.length === 0) return;

      const resource = this.resources.get(selection.resourceId);
      if (!resource) return;

      // Resolve dependencies for the selected actions
      const resolvedActions = this.resolveDependencies(selection.actions);
      const resourceArn = selection.arn || '*';
      const key = `${resourceArn}:${resolvedActions.sort().join(',')}`;

      if (statementMap.has(key)) {
        const existing = statementMap.get(key)!;
        if (Array.isArray(existing.Action)) {
          existing.Action = [...new Set([...existing.Action, ...resolvedActions])];
        }
      } else {
        const statement: PolicyStatement = {
          Effect: 'Allow',
          Action: resolvedActions.map((action) => (action.includes(':') ? action : `${resource.service}:${action}`)),
          Resource: resourceArn,
        };
        statementMap.set(key, statement);
        statements.push(statement);
      }
    });

    return {
      Version: '2012-10-17',
      Statement: this.optimizeStatements(statements),
    };
  }

  private optimizeStatements(statements: PolicyStatement[]): PolicyStatement[] {
    const optimized: PolicyStatement[] = [];
    const resourceGroups = new Map<string, PolicyStatement>();

    statements.forEach((statement) => {
      const resource = Array.isArray(statement.Resource)
        ? statement.Resource.join(',')
        : statement.Resource;

      if (resourceGroups.has(resource)) {
        const existing = resourceGroups.get(resource)!;
        const existingActions = Array.isArray(existing.Action)
          ? existing.Action
          : [existing.Action];
        const newActions = Array.isArray(statement.Action)
          ? statement.Action
          : [statement.Action];

        existing.Action = [...new Set([...existingActions, ...newActions])];
      } else {
        resourceGroups.set(resource, { ...statement });
      }
    });

    resourceGroups.forEach((statement) => {
      optimized.push(statement);
    });

    return optimized;
  }

  reset(): void {
    this.resources.clear();
    this.selections.clear();
    this.arnList = [];
  }

  getState() {
    return {
      resources: Array.from(this.resources.values()),
      selections: Array.from(this.selections.values()),
      arnList: this.arnList,
    };
  }
}
