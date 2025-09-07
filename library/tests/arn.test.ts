import {
  parseARN,
  formatARN,
  validateARNFormat,
  extractServiceFromARN,
  extractResourceTypeFromARN,
  filterARNsByService,
  filterARNsByResourceType,
  matchARNPattern,
  generateARNSuggestions,
} from '../src/utils/arn';
import { ARNItem } from '../src/types';

describe('ARN Utilities', () => {
  describe('parseARN', () => {
    test('should parse valid S3 ARN', () => {
      const arn = 'arn:aws:s3:::my-bucket';
      const parsed = parseARN(arn);
      
      expect(parsed).not.toBeNull();
      expect(parsed!.partition).toBe('aws');
      expect(parsed!.service).toBe('s3');
      expect(parsed!.region).toBe('');
      expect(parsed!.accountId).toBe('');
      expect(parsed!.resourceType).toBeUndefined();
      expect(parsed!.resource).toBe('my-bucket');
    });

    test('should parse S3 ARN without resource type', () => {
      const arn = 'arn:aws:s3:::my-bucket';
      const parsed = parseARN(arn);
      
      expect(parsed).not.toBeNull();
      expect(parsed!.service).toBe('s3');
      expect(parsed!.region).toBe('');
      expect(parsed!.accountId).toBe('');
      expect(parsed!.resource).toBe('my-bucket');
      expect(parsed!.resourceType).toBeUndefined();
    });

    test('should parse EC2 ARN with colon separator', () => {
      const arn = 'arn:aws:ec2:us-east-1:123456789012:instance:i-1234567890abcdef0';
      const parsed = parseARN(arn);
      
      expect(parsed).not.toBeNull();
      expect(parsed!.service).toBe('ec2');
      expect(parsed!.resourceType).toBe('instance');
      expect(parsed!.resource).toBe('i-1234567890abcdef0');
    });

    test('should return null for invalid ARN', () => {
      const invalid = 'not-an-arn';
      const parsed = parseARN(invalid);
      
      expect(parsed).toBeNull();
    });

    test('should handle complex resource paths', () => {
      const arn = 'arn:aws:s3:::my-bucket/path/to/object.txt';
      const parsed = parseARN(arn);
      
      expect(parsed).not.toBeNull();
      expect(parsed!.resource).toBe('my-bucket/path/to/object.txt');
    });
  });

  describe('formatARN', () => {
    test('should format ARN with resource type', () => {
      const parsed = {
        partition: 'aws',
        service: 's3',
        region: 'us-east-1',
        accountId: '123456789012',
        resource: 'my-bucket',
        resourceType: 'bucket',
      };
      
      const formatted = formatARN(parsed);
      expect(formatted).toBe('arn:aws:s3:us-east-1:123456789012:bucket/my-bucket');
    });

    test('should format ARN without resource type', () => {
      const parsed = {
        partition: 'aws',
        service: 's3',
        region: '',
        accountId: '',
        resource: 'my-bucket',
      };
      
      const formatted = formatARN(parsed);
      expect(formatted).toBe('arn:aws:s3:::my-bucket');
    });
  });

  describe('validateARNFormat', () => {
    test('should validate correct ARN formats', () => {
      const validARNs = [
        'arn:aws:s3:::my-bucket',
        'arn:aws:s3:::my-bucket/*',
        'arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0',
        'arn:aws:iam::123456789012:role/MyRole',
        'arn:aws:lambda:us-west-2:123456789012:function:MyFunction',
      ];
      
      validARNs.forEach(arn => {
        expect(validateARNFormat(arn)).toBe(true);
      });
    });

    test('should reject invalid ARN formats', () => {
      const invalidARNs = [
        '',
        'not-an-arn',
        'arn:aws:s3',
        'arn:aws:s3::',
        'arn::s3:::bucket',
      ];
      
      invalidARNs.forEach(arn => {
        expect(validateARNFormat(arn)).toBe(false);
      });
    });
  });

  describe('extractServiceFromARN', () => {
    test('should extract service from valid ARNs', () => {
      expect(extractServiceFromARN('arn:aws:s3:::bucket')).toBe('s3');
      expect(extractServiceFromARN('arn:aws:ec2:us-east-1:123:instance/i-123')).toBe('ec2');
      expect(extractServiceFromARN('arn:aws:lambda:us-west-2:123:function:MyFunc')).toBe('lambda');
    });

    test('should return null for invalid ARNs', () => {
      expect(extractServiceFromARN('invalid-arn')).toBeNull();
      expect(extractServiceFromARN('')).toBeNull();
    });
  });

  describe('extractResourceTypeFromARN', () => {
    test('should extract resource type when present', () => {
      expect(extractResourceTypeFromARN('arn:aws:ec2:us-east-1:123:instance/i-123')).toBe('instance');
      expect(extractResourceTypeFromARN('arn:aws:iam::123:role/MyRole')).toBe('role');
    });

    test('should return null when no resource type', () => {
      expect(extractResourceTypeFromARN('arn:aws:s3:::bucket')).toBeNull();
    });

    test('should return null for invalid ARNs', () => {
      expect(extractResourceTypeFromARN('invalid-arn')).toBeNull();
    });
  });

  describe('filterARNsByService', () => {
    const sampleARNs: ARNItem[] = [
      { arn: 'arn:aws:s3:::bucket1', service: 's3', displayName: 'Bucket 1' },
      { arn: 'arn:aws:s3:::bucket2', service: 's3', displayName: 'Bucket 2' },
      { arn: 'arn:aws:ec2:us-east-1:123:instance/i-123', service: 'ec2', displayName: 'Instance' },
      { arn: 'arn:aws:lambda:us-west-2:123:function:func', service: 'lambda', displayName: 'Function' },
    ];

    test('should filter ARNs by service', () => {
      const s3ARNs = filterARNsByService(sampleARNs, 's3');
      expect(s3ARNs).toHaveLength(2);
      expect(s3ARNs.every(arn => arn.service === 's3')).toBe(true);
    });

    test('should return empty array for non-existent service', () => {
      const result = filterARNsByService(sampleARNs, 'rds');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterARNsByResourceType', () => {
    const sampleARNs: ARNItem[] = [
      { arn: 'arn:aws:s3:::bucket', service: 's3', resourceType: 'bucket' },
      { arn: 'arn:aws:s3:::bucket/*', service: 's3', resourceType: 'object' },
      { arn: 'arn:aws:ec2:us-east-1:123:instance/i-123', service: 'ec2', resourceType: 'instance' },
    ];

    test('should filter ARNs by resource type', () => {
      const bucketARNs = filterARNsByResourceType(sampleARNs, 'bucket');
      expect(bucketARNs).toHaveLength(1);
      expect(bucketARNs[0].resourceType).toBe('bucket');
    });

    test('should return empty array for non-existent resource type', () => {
      const result = filterARNsByResourceType(sampleARNs, 'volume');
      expect(result).toHaveLength(0);
    });
  });

  describe('matchARNPattern', () => {
    test('should match exact ARN', () => {
      const arn = 'arn:aws:s3:::my-bucket/path';
      const pattern = 'arn:aws:s3:::my-bucket/path';
      expect(matchARNPattern(arn, pattern)).toBe(true);
    });

    test('should match wildcard patterns', () => {
      const arn = 'arn:aws:s3:::my-bucket/path/to/file.txt';
      const pattern = 'arn:aws:s3:::my-bucket/*';
      expect(matchARNPattern(arn, pattern)).toBe(true);
    });

    test('should match single character wildcards', () => {
      const arn = 'arn:aws:s3:::my-bucket1';
      const pattern = 'arn:aws:s3:::my-bucket?';
      expect(matchARNPattern(arn, pattern)).toBe(true);
    });

    test('should not match non-matching patterns', () => {
      const arn = 'arn:aws:s3:::my-bucket/file.txt';
      const pattern = 'arn:aws:ec2:*';
      expect(matchARNPattern(arn, pattern)).toBe(false);
    });

    test('should handle dollar signs in ARNs', () => {
      const arn = 'arn:aws:s3:::bucket$special';
      const pattern = 'arn:aws:s3:::bucket$special';
      expect(matchARNPattern(arn, pattern)).toBe(true);
    });
  });

  describe('generateARNSuggestions', () => {
    test('should generate S3 suggestions', () => {
      const suggestions = generateARNSuggestions('s3');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.every(arn => arn.includes('s3'))).toBe(true);
    });

    test('should generate EC2 suggestions with region and account', () => {
      const suggestions = generateARNSuggestions('ec2', 'us-west-2', '999999999999');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.every(arn => arn.includes('us-west-2'))).toBe(true);
      expect(suggestions.every(arn => arn.includes('999999999999'))).toBe(true);
    });

    test('should generate Lambda suggestions', () => {
      const suggestions = generateARNSuggestions('lambda');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.every(arn => arn.includes('lambda'))).toBe(true);
    });

    test('should generate IAM suggestions', () => {
      const suggestions = generateARNSuggestions('iam');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.every(arn => arn.includes('iam'))).toBe(true);
    });

    test('should generate DynamoDB suggestions', () => {
      const suggestions = generateARNSuggestions('dynamodb');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.every(arn => arn.includes('dynamodb'))).toBe(true);
    });

    test('should generate generic suggestions for unknown services', () => {
      const suggestions = generateARNSuggestions('unknown-service');
      expect(suggestions.length).toBe(1);
      expect(suggestions[0]).toContain('unknown-service');
    });
  });
});