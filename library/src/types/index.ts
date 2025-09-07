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

export interface ARNItem {
  arn: string;
  service: string;
  resourceType?: string;
  displayName?: string;
  description?: string;
  tags?: Record<string, string>;
}

export interface PolicyGeneratorProps {
  services?: AWSResource[];
  defaultSelections?: Selection[];
  arnList?: ARNItem[];
  theme?: 'light' | 'dark' | Theme;
  layout?: 'horizontal' | 'vertical' | 'responsive';
  breakpoint?: number;
  locale?: 'en' | 'ko' | 'ja' | 'zh';
  onChange?: (policy: IAMPolicy) => void;
  onCopy?: (policy: string) => void;
  onARNSelect?: (resourceId: string, arn: string) => void;
  maxStatements?: number;
  allowWildcards?: boolean;
  arnInputMode?: 'input' | 'dropdown' | 'both' | 'auto';
  className?: string;
  styles?: StyleOverrides;
  components?: ComponentOverrides;
}

export interface Selection {
  resourceId: string;
  actions: string[];
  arn?: string;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    border: string;
    read: string;
    write: string;
    admin: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      sm: string;
      base: string;
      lg: string;
    };
  };
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export type StyleOverrides = Record<string, React.CSSProperties>;
export type ComponentOverrides = Record<string, React.ComponentType<any>>;

export interface ValidationResult {
  valid: boolean;
  message?: string;
  suggestions?: string[];
}

export interface DependencyConfig {
  service: string;
  dependencies: Record<string, {
    actions?: string[];
    dependencies?: string[];
    requires?: string[];
    soft_requires?: string[];
    description?: string;
  }>;
}
