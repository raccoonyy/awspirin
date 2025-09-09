export interface AWSResource {
  id: string;
  name: string;
  service: string;
  icon?: string;
  description?: string;
  arnPattern?: string;
  actions: AWSAction[];
}

export interface AWSAction {
  id: string;
  name: string;
  description?: string;
  category: 'read' | 'write' | 'admin';
  dependencies?: string[];
  requiresARN?: boolean;
}

export interface IAMPolicy {
  Version: string;
  Statement: PolicyStatement[];
}

export interface PolicyStatement {
  Effect: 'Allow' | 'Deny';
  Action: string | string[];
  Resource: string | string[];
  Condition?: Record<string, any>;
}