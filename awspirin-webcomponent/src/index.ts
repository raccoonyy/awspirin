// Export the main web component
export { AWSPolicyGenerator } from './components/aws-policy-generator.js'

// Export types for TypeScript users
export type { 
  AWSResource, 
  AWSAction, 
  PolicyStatement, 
  IAMPolicy, 
  PolicyGeneratorConfig 
} from '@shared/types'

// Export utilities for advanced users
export { 
  generateIAMPolicy, 
  generatePolicyStatements, 
  getAllAwsActions, 
  isValidArn, 
  processServiceArn 
} from '@shared/utils/policy-generator'

// Export data for customization
export { 
  defaultAWSResources, 
  createAWSResources 
} from '@shared/data/aws-resources'

export { 
  defaultAWSActions, 
  createAWSActions 
} from '@shared/data/aws-actions'

// Auto-register the web component
import './components/aws-policy-generator.js'