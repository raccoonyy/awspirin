import { ARNItem } from '../types';

export interface ParsedARN {
  partition: string;
  service: string;
  region: string;
  accountId: string;
  resource: string;
  resourceType?: string;
}

export function parseARN(arn: string): ParsedARN | null {
  const arnPattern = /^arn:([^:]+):([^:]+):([^:]*):([^:]*):(.+)$/;
  const match = arn.match(arnPattern);

  if (!match) {
    return null;
  }

  const [, partition, service, region, accountId, resourcePart] = match;

  let resourceType: string | undefined;
  let resource: string;

  // Handle different resource formats
  if (service === 's3') {
    // S3 ARNs: arn:aws:s3:::bucket-name or arn:aws:s3:::bucket-name/key
    resource = resourcePart;
  } else if (resourcePart.includes('/')) {
    // Format: resource-type/resource-id
    const parts = resourcePart.split('/');
    resourceType = parts[0];
    resource = parts.slice(1).join('/');
  } else if (resourcePart.includes(':')) {
    // Format: resource-type:resource-id
    const parts = resourcePart.split(':');
    resourceType = parts[0];
    resource = parts.slice(1).join(':');
  } else {
    resource = resourcePart;
  }

  return {
    partition,
    service,
    region,
    accountId,
    resource,
    resourceType,
  };
}

export function formatARN(parsed: ParsedARN): string {
  const resourcePart = parsed.resourceType
    ? `${parsed.resourceType}/${parsed.resource}`
    : parsed.resource;

  return `arn:${parsed.partition}:${parsed.service}:${parsed.region}:${parsed.accountId}:${resourcePart}`;
}

export function validateARNFormat(arn: string): boolean {
  const arnPattern = /^arn:[^:]+:[^:]+:[^:]*:[^:]*:.+$/;
  return arnPattern.test(arn);
}

export function extractServiceFromARN(arn: string): string | null {
  const parsed = parseARN(arn);
  return parsed?.service || null;
}

export function extractResourceTypeFromARN(arn: string): string | null {
  const parsed = parseARN(arn);
  return parsed?.resourceType || null;
}

export function filterARNsByService(arns: ARNItem[], service: string): ARNItem[] {
  return arns.filter((item) => item.service === service);
}

export function filterARNsByResourceType(arns: ARNItem[], resourceType: string): ARNItem[] {
  return arns.filter((item) => item.resourceType === resourceType);
}

export function matchARNPattern(arn: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.')
    .replace(/\$/g, '\\$');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(arn);
}

export function generateARNSuggestions(service: string, region?: string, accountId?: string): string[] {
  const defaultRegion = region || 'us-east-1';
  const defaultAccount = accountId || '123456789012';

  const servicePatterns: Record<string, string[]> = {
    s3: [
      'arn:aws:s3:::bucket-name/*',
      'arn:aws:s3:::bucket-name',
      'arn:aws:s3:::*',
    ],
    ec2: [
      `arn:aws:ec2:${defaultRegion}:${defaultAccount}:instance/*`,
      `arn:aws:ec2:${defaultRegion}:${defaultAccount}:volume/*`,
      `arn:aws:ec2:${defaultRegion}:${defaultAccount}:security-group/*`,
    ],
    lambda: [
      `arn:aws:lambda:${defaultRegion}:${defaultAccount}:function:*`,
      `arn:aws:lambda:${defaultRegion}:${defaultAccount}:function:function-name`,
    ],
    iam: [
      `arn:aws:iam::${defaultAccount}:role/*`,
      `arn:aws:iam::${defaultAccount}:user/*`,
      `arn:aws:iam::${defaultAccount}:policy/*`,
    ],
    dynamodb: [
      `arn:aws:dynamodb:${defaultRegion}:${defaultAccount}:table/*`,
      `arn:aws:dynamodb:${defaultRegion}:${defaultAccount}:table/table-name`,
    ],
  };

  return servicePatterns[service] || [`arn:aws:${service}:${defaultRegion}:${defaultAccount}:*`];
}
