import { describe, it, expect, beforeEach } from 'vitest'
import { generateIAMPolicy, isValidArn, processServiceArn } from '@shared/utils/policy-generator'
import type { AWSResource, AWSAction } from '@shared/types'

describe('Policy Generator Utils', () => {
  describe('isValidArn', () => {
    it('should validate correct ARN format', () => {
      expect(isValidArn('arn:aws:s3:::my-bucket')).toBe(true)
      expect(isValidArn('arn:aws:lambda:us-east-1:123456789012:function:my-function')).toBe(true)
      expect(isValidArn('arn:aws:dynamodb:us-east-1:123456789012:table/my-table')).toBe(true)
    })

    it('should reject invalid ARN format', () => {
      expect(isValidArn('')).toBe(false)
      expect(isValidArn('not-an-arn')).toBe(false)
      expect(isValidArn('arn:aws:s3')).toBe(false)
      expect(isValidArn('arn:aws:s3:::')).toBe(false)
    })
  })

  describe('processServiceArn', () => {
    it('should process S3 ARNs correctly', () => {
      const bucketArn = 'arn:aws:s3:::my-bucket'
      const result = processServiceArn('s3', bucketArn)
      expect(result).toContain('arn:aws:s3:::my-bucket')
      expect(result).toContain('arn:aws:s3:::my-bucket/*')
    })

    it('should process DynamoDB ARNs correctly', () => {
      const tableArn = 'arn:aws:dynamodb:us-east-1:123456789012:table/my-table'
      const result = processServiceArn('dynamodb', tableArn)
      expect(result).toContain('arn:aws:dynamodb:us-east-1:123456789012:table/my-table')
      expect(result).toContain('arn:aws:dynamodb:us-east-1:123456789012:table/my-table/*')
    })

    it('should process Lambda ARNs correctly', () => {
      const functionArn = 'arn:aws:lambda:us-east-1:123456789012:function:my-function'
      const result = processServiceArn('lambda', functionArn)
      expect(result).toContain('arn:aws:lambda:us-east-1:123456789012:function:my-function')
      expect(result).toContain('arn:aws:lambda:us-east-1:123456789012:function:my-function:*')
    })
  })

  describe('generateIAMPolicy', () => {
    let mockResources: AWSResource[]
    let mockActions: Record<string, AWSAction[]>
    let selectedActions: AWSAction[]

    beforeEach(() => {
      mockResources = [
        {
          id: 's3',
          name: 'Amazon S3',
          description: 'Object storage',
          icon: '🪣',
          selected: true,
          arn: 'arn:aws:s3:::my-bucket'
        }
      ]

      mockActions = {
        s3: [
          {
            id: 's3-read',
            name: 'Read Objects',
            description: 'Read S3 objects',
            category: 'read',
            actions: ['s3:GetObject'],
            dependencies: ['s3:ListBucket'],
            selected: true
          }
        ]
      }

      selectedActions = [mockActions.s3[0]]
    })

    it('should generate valid IAM policy', () => {
      const policy = generateIAMPolicy(mockResources, selectedActions, mockActions)
      
      expect(policy).toBeDefined()
      expect(policy?.Version).toBe('2012-10-17')
      expect(policy?.Statement).toHaveLength(1)
      expect(policy?.Statement[0].Effect).toBe('Allow')
      expect(policy?.Statement[0].Action).toContain('s3:GetObject')
      expect(policy?.Statement[0].Action).toContain('s3:ListBucket')
    })

    it('should return null for empty selections', () => {
      const policy = generateIAMPolicy([], [], {})
      expect(policy).toBeNull()
    })

    it('should handle resources without ARN', () => {
      mockResources[0].arn = undefined
      const policy = generateIAMPolicy(mockResources, selectedActions, mockActions)
      
      expect(policy?.Statement[0].Resource).toBe('*')
    })

    it('should process S3 ARNs correctly in policy', () => {
      const policy = generateIAMPolicy(mockResources, selectedActions, mockActions)
      const resources = policy?.Statement[0].Resource as string[]
      
      expect(resources).toContain('arn:aws:s3:::my-bucket')
      expect(resources).toContain('arn:aws:s3:::my-bucket/*')
    })
  })
})