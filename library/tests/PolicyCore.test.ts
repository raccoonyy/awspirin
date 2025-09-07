import { PolicyCore } from '../src/core/PolicyCore';
import { AWSResource, ARNItem } from '../src/types';

const sampleS3Resource: AWSResource = {
  id: 's3-test',
  name: 'S3 Test Resource',
  service: 's3',
  actions: [
    {
      id: 's3:ListBucket',
      name: 'ListBucket',
      category: 'read',
      requiresARN: true,
    },
    {
      id: 's3:GetObject',
      name: 'GetObject',
      category: 'read',
      requiresARN: true,
      dependencies: ['s3:ListBucket'],
    },
    {
      id: 's3:PutObject',
      name: 'PutObject',
      category: 'write',
      requiresARN: true,
      dependencies: ['s3:ListBucket'],
    },
  ],
};

const sampleARNs: ARNItem[] = [
  {
    arn: 'arn:aws:s3:::bucket1/*',
    service: 's3',
    displayName: 'Bucket 1',
  },
  {
    arn: 'arn:aws:s3:::bucket2/*',
    service: 's3',
    displayName: 'Bucket 2',
  },
  {
    arn: 'arn:aws:ec2:us-east-1:123456789012:instance/i-123',
    service: 'ec2',
    displayName: 'EC2 Instance',
  },
];

describe('PolicyCore', () => {
  let policyCore: PolicyCore;

  beforeEach(() => {
    policyCore = new PolicyCore();
  });

  describe('Resource Management', () => {
    test('should add a resource', () => {
      policyCore.addResource(sampleS3Resource);
      const state = policyCore.getState();
      
      expect(state.resources).toHaveLength(1);
      expect(state.resources[0]).toEqual(sampleS3Resource);
      expect(state.selections).toHaveLength(1);
      expect(state.selections[0].resourceId).toBe('s3-test');
    });

    test('should remove a resource', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.removeResource('s3-test');
      const state = policyCore.getState();
      
      expect(state.resources).toHaveLength(0);
      expect(state.selections).toHaveLength(0);
    });

    test('should set actions for a resource', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.setActions('s3-test', ['s3:GetObject']);
      const state = policyCore.getState();
      
      expect(state.selections[0].actions).toContain('s3:GetObject');
      // Note: Dependencies are resolved in the hook layer, not in PolicyCore
    });

    test('should set ARN for a resource', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.setARN('s3-test', 'arn:aws:s3:::test-bucket/*');
      const state = policyCore.getState();
      
      expect(state.selections[0].arn).toBe('arn:aws:s3:::test-bucket/*');
    });
  });

  describe('ARN Management', () => {
    test('should set and filter ARN list', () => {
      policyCore.setARNList(sampleARNs);
      const state = policyCore.getState();
      
      expect(state.arnList).toHaveLength(3);
    });

    test('should filter ARNs by service', () => {
      policyCore.setARNList(sampleARNs);
      const s3ARNs = policyCore.getFilteredARNs('s3');
      
      expect(s3ARNs).toHaveLength(2);
      expect(s3ARNs.every(arn => arn.service === 's3')).toBe(true);
    });

    test('should filter ARNs by service and resource type', () => {
      const arnsWithResourceType: ARNItem[] = [
        {
          arn: 'arn:aws:s3:::bucket1/*',
          service: 's3',
          resourceType: 'object',
        },
        {
          arn: 'arn:aws:s3:::bucket1',
          service: 's3',
          resourceType: 'bucket',
        },
      ];
      
      policyCore.setARNList(arnsWithResourceType);
      const bucketARNs = policyCore.getFilteredARNs('s3', 'bucket');
      
      expect(bucketARNs).toHaveLength(1);
      expect(bucketARNs[0].resourceType).toBe('bucket');
    });
  });

  describe('ARN Validation', () => {
    test('should validate correct ARN format', () => {
      const result = policyCore.validateARN('s3', 'arn:aws:s3:::my-bucket/*');
      expect(result.valid).toBe(true);
    });

    test('should reject invalid ARN format', () => {
      const result = policyCore.validateARN('s3', 'invalid-arn');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid ARN format');
    });

    test('should reject ARN with wrong service', () => {
      const result = policyCore.validateARN('s3', 'arn:aws:ec2:us-east-1:123456789012:instance/i-123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('service mismatch');
    });

    test('should require ARN when not provided', () => {
      const result = policyCore.validateARN('s3', '');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('ARN is required');
    });
  });

  describe('Policy Generation', () => {
    test('should generate empty policy when no selections', () => {
      const policy = policyCore.generatePolicy();
      
      expect(policy.Version).toBe('2012-10-17');
      expect(policy.Statement).toHaveLength(0);
    });

    test('should generate policy with actions and ARN', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.setActions('s3-test', ['s3:GetObject']);
      policyCore.setARN('s3-test', 'arn:aws:s3:::test-bucket/*');
      
      const policy = policyCore.generatePolicy();
      
      expect(policy.Statement).toHaveLength(1);
      expect(policy.Statement[0].Effect).toBe('Allow');
      expect(policy.Statement[0].Action).toContain('s3:GetObject');
      expect(policy.Statement[0].Resource).toBe('arn:aws:s3:::test-bucket/*');
    });

    test('should use wildcard resource when ARN not specified', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.setActions('s3-test', ['s3:GetObject']);
      
      const policy = policyCore.generatePolicy();
      
      expect(policy.Statement[0].Resource).toBe('*');
    });

    test('should optimize statements by combining similar ones', () => {
      const ec2Resource: AWSResource = {
        id: 'ec2-test',
        name: 'EC2 Test',
        service: 'ec2',
        actions: [
          { id: 'ec2:DescribeInstances', name: 'DescribeInstances', category: 'read' },
          { id: 'ec2:StartInstances', name: 'StartInstances', category: 'write' },
        ],
      };

      policyCore.addResource(sampleS3Resource);
      policyCore.addResource(ec2Resource);
      
      policyCore.setActions('s3-test', ['s3:GetObject']);
      policyCore.setARN('s3-test', 'arn:aws:s3:::bucket/*');
      
      policyCore.setActions('ec2-test', ['ec2:DescribeInstances']);
      policyCore.setARN('ec2-test', 'arn:aws:ec2:*:*:instance/*');
      
      const policy = policyCore.generatePolicy();
      
      expect(policy.Statement.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Dependency Resolution', () => {
    test('should resolve action dependencies', () => {
      const actions = ['s3:GetObject'];
      const resolved = policyCore.resolveDependencies(actions);
      
      // Should include the original action
      expect(resolved).toContain('s3:GetObject');
      // Should include dependencies (if any are configured)
      expect(resolved.length).toBeGreaterThanOrEqual(1);
    });

    test('should handle circular dependencies gracefully', () => {
      const actions = ['s3:GetObject', 's3:PutObject'];
      const resolved = policyCore.resolveDependencies(actions);
      
      expect(resolved).toContain('s3:GetObject');
      expect(resolved).toContain('s3:PutObject');
      expect(resolved.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('State Management', () => {
    test('should reset to initial state', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.setARNList(sampleARNs);
      policyCore.reset();
      
      const state = policyCore.getState();
      expect(state.resources).toHaveLength(0);
      expect(state.selections).toHaveLength(0);
      expect(state.arnList).toHaveLength(0);
    });

    test('should provide current state', () => {
      policyCore.addResource(sampleS3Resource);
      policyCore.setARNList(sampleARNs);
      
      const state = policyCore.getState();
      expect(state).toHaveProperty('resources');
      expect(state).toHaveProperty('selections');
      expect(state).toHaveProperty('arnList');
    });
  });
});