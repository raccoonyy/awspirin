import yaml from 'js-yaml';
import { DependencyConfig } from '../types';

const dependencyCache = new Map<string, DependencyConfig>();

export async function loadDependencies(service: string): Promise<DependencyConfig | null> {
  if (dependencyCache.has(service)) {
    return dependencyCache.get(service)!;
  }

  try {
    const response = await fetch(`/data/dependencies/${service}-dependencies.yaml`);
    if (!response.ok) {
      return null;
    }

    const yamlContent = await response.text();
    const config = yaml.load(yamlContent) as DependencyConfig;

    dependencyCache.set(service, config);
    return config;
  } catch (error) {
    console.error(`Failed to load dependencies for ${service}:`, error);
    return null;
  }
}

export function resolveDependencies(
  actions: string[],
  dependencyConfig: DependencyConfig | null,
): string[] {
  if (!dependencyConfig) {
    return actions;
  }

  const resolved = new Set<string>();
  const toProcess = [...actions];
  const processed = new Set<string>();

  while (toProcess.length > 0) {
    const action = toProcess.pop()!;

    if (processed.has(action)) {
      continue;
    }
    processed.add(action);

    const deps = dependencyConfig.dependencies[action];
    
    // Add the action itself and its actions array
    if (deps?.actions) {
      deps.actions.forEach((a) => resolved.add(a));
    } else {
      resolved.add(action);
    }

    // Add dependencies
    if (deps?.dependencies) {
      deps.dependencies.forEach((dep) => {
        if (!processed.has(dep)) {
          toProcess.push(dep);
        }
      });
    }
    
    // Handle old format for backward compatibility
    if (deps?.requires) {
      deps.requires.forEach((dep) => {
        resolved.add(dep);
        if (!processed.has(dep)) {
          toProcess.push(dep);
        }
      });
    }
  }

  return Array.from(resolved);
}

export function getSoftDependencies(
  action: string,
  dependencyConfig: DependencyConfig | null,
): string[] {
  if (!dependencyConfig) {
    return [];
  }

  const deps = dependencyConfig.dependencies[action];
  return deps?.soft_requires || [];
}

export function getDependencyDescription(
  action: string,
  dependencyConfig: DependencyConfig | null,
): string | null {
  if (!dependencyConfig) {
    return null;
  }

  const deps = dependencyConfig.dependencies[action];
  return deps?.description || null;
}

const staticDependencies: Record<string, DependencyConfig> = {
  s3: {
    service: 's3',
    dependencies: {
      's3:ListBucket': {
        actions: ['s3:ListBucket'],
        dependencies: [],
      },
      's3:GetBucketLocation': {
        actions: ['s3:GetBucketLocation'],
        dependencies: [],
      },
      's3:GetObject': {
        actions: ['s3:GetObject'],
        dependencies: ['s3:ListBucket', 's3:GetBucketLocation'],
      },
      's3:PutObject': {
        actions: ['s3:PutObject'],
        dependencies: ['s3:ListBucket'],
      },
      's3:DeleteObject': {
        actions: ['s3:DeleteObject'],
        dependencies: ['s3:ListBucket'],
      },
    },
  },
  ec2: {
    service: 'ec2',
    dependencies: {
      'ec2:DescribeInstances': {
        actions: ['ec2:DescribeInstances'],
        dependencies: [],
      },
      'ec2:TerminateInstances': {
        actions: ['ec2:TerminateInstances'],
        dependencies: ['ec2:DescribeInstances'],
      },
      'ec2:StopInstances': {
        actions: ['ec2:StopInstances'],
        dependencies: ['ec2:DescribeInstances'],
      },
      'ec2:StartInstances': {
        actions: ['ec2:StartInstances'],
        dependencies: ['ec2:DescribeInstances'],
      },
    },
  },
  lambda: {
    service: 'lambda',
    dependencies: {
      'lambda:GetFunction': {
        actions: ['lambda:GetFunction'],
        dependencies: [],
      },
      'lambda:InvokeFunction': {
        actions: ['lambda:InvokeFunction'],
        dependencies: ['lambda:GetFunction'],
      },
      'lambda:UpdateFunctionCode': {
        actions: ['lambda:UpdateFunctionCode'],
        dependencies: ['lambda:GetFunction'],
      },
      'lambda:DeleteFunction': {
        actions: ['lambda:DeleteFunction'],
        dependencies: ['lambda:GetFunction'],
      },
    },
  },
  dynamodb: {
    service: 'dynamodb',
    dependencies: {
      'dynamodb:DescribeTable': {
        actions: ['dynamodb:DescribeTable'],
        dependencies: [],
      },
      'dynamodb:GetItem': {
        actions: ['dynamodb:GetItem'],
        dependencies: ['dynamodb:DescribeTable'],
      },
      'dynamodb:PutItem': {
        actions: ['dynamodb:PutItem'],
        dependencies: ['dynamodb:DescribeTable'],
      },
      'dynamodb:Query': {
        actions: ['dynamodb:Query'],
        dependencies: ['dynamodb:DescribeTable'],
      },
      'dynamodb:Scan': {
        actions: ['dynamodb:Scan'],
        dependencies: ['dynamodb:DescribeTable'],
      },
    },
  },
};

export function getStaticDependencies(service: string): DependencyConfig | null {
  return staticDependencies[service] || null;
}
