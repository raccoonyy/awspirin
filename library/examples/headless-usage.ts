// Example of using the headless PolicyCore for custom implementations
import { PolicyCore, parseARN, validateARNFormat } from '../src/core';

// Example: Building a CLI tool or server-side policy generation
function headlessExample() {
  console.log('=== AWS Policy Generator - Headless Usage Example ===\n');

  // Initialize the policy core
  const policyGen = new PolicyCore();

  // Sample resources (in a real app, these would come from your data source)
  const s3Resource = {
    id: 's3-bucket',
    name: 'S3 Bucket',
    service: 's3',
    actions: [
      {
        id: 's3:ListBucket',
        name: 'ListBucket',
        category: 'read' as const,
        requiresARN: true,
      },
      {
        id: 's3:GetObject',
        name: 'GetObject',
        category: 'read' as const,
        requiresARN: true,
        dependencies: ['s3:ListBucket'],
      },
      {
        id: 's3:PutObject',
        name: 'PutObject',
        category: 'write' as const,
        requiresARN: true,
        dependencies: ['s3:ListBucket'],
      },
    ],
  };

  // Add resource to policy generator
  policyGen.addResource(s3Resource);
  console.log('✅ Added S3 resource');

  // Set ARN for the resource
  const s3ARN = 'arn:aws:s3:::my-application-bucket/*';
  const arnValidation = policyGen.validateARN('s3', s3ARN);
  
  if (arnValidation.valid) {
    policyGen.setARN('s3-bucket', s3ARN);
    console.log('✅ Set valid S3 ARN:', s3ARN);
  } else {
    console.log('❌ Invalid ARN:', arnValidation.message);
    return;
  }

  // Set actions (dependencies will be automatically resolved)
  const requestedActions = ['s3:GetObject', 's3:PutObject'];
  policyGen.setActions('s3-bucket', requestedActions);
  console.log('✅ Set actions:', requestedActions);

  // Generate the final policy
  const policy = policyGen.generatePolicy();
  console.log('\n📄 Generated IAM Policy:');
  console.log(JSON.stringify(policy, null, 2));

  // Demonstrate ARN parsing utilities
  console.log('\n🔍 ARN Analysis:');
  const parsedARN = parseARN(s3ARN);
  if (parsedARN) {
    console.log('- Service:', parsedARN.service);
    console.log('- Region:', parsedARN.region || 'global');
    console.log('- Account ID:', parsedARN.accountId || 'not specified');
    console.log('- Resource:', parsedARN.resource);
  }

  // Validate ARN format
  console.log('- ARN Format Valid:', validateARNFormat(s3ARN));

  // Example with invalid ARN
  const invalidARN = 'invalid-arn-format';
  console.log('- Invalid ARN Format Valid:', validateARNFormat(invalidARN));

  // Get current state for inspection
  const state = policyGen.getState();
  console.log('\n📊 Current State:');
  console.log('- Resources:', state.resources.length);
  console.log('- Selections:', state.selections.length);
  console.log('- ARN List:', state.arnList.length);

  // Demonstrate filtering ARNs (when you have a list)
  const sampleARNs = [
    {
      arn: 'arn:aws:s3:::bucket1/*',
      service: 's3',
      displayName: 'Bucket 1',
    },
    {
      arn: 'arn:aws:ec2:us-east-1:123456789012:instance/i-123',
      service: 'ec2',
      displayName: 'Instance 1',
    },
    {
      arn: 'arn:aws:s3:::bucket2/*',
      service: 's3',
      displayName: 'Bucket 2',
    },
  ];

  policyGen.setARNList(sampleARNs);
  const s3ARNs = policyGen.getFilteredARNs('s3');
  console.log('\n🗂️ Filtered S3 ARNs:', s3ARNs.length);
  s3ARNs.forEach(arn => console.log(`- ${arn.displayName}: ${arn.arn}`));

  console.log('\n✨ Headless usage complete!');
}

// Example: Integration with a web API
async function apiIntegrationExample() {
  console.log('\n=== API Integration Example ===\n');

  const policyGen = new PolicyCore();

  // Simulate receiving data from an API request
  const apiRequest = {
    resources: [
      {
        service: 'dynamodb',
        permissions: ['read', 'write'],
        arn: 'arn:aws:dynamodb:us-east-1:123456789012:table/Users',
      },
    ],
  };

  // Process the API request
  for (const resourceReq of apiRequest.resources) {
    // In a real implementation, you would load resource definitions from your data store
    const dynamoResource = {
      id: `${resourceReq.service}-resource`,
      name: 'DynamoDB Table',
      service: resourceReq.service,
      actions: [
        {
          id: 'dynamodb:GetItem',
          name: 'GetItem',
          category: 'read' as const,
          requiresARN: true,
        },
        {
          id: 'dynamodb:PutItem',
          name: 'PutItem',
          category: 'write' as const,
          requiresARN: true,
        },
        {
          id: 'dynamodb:Query',
          name: 'Query',
          category: 'read' as const,
          requiresARN: true,
        },
      ],
    };

    policyGen.addResource(dynamoResource);

    // Map permission levels to specific actions
    const actions: string[] = [];
    if (resourceReq.permissions.includes('read')) {
      actions.push('dynamodb:GetItem', 'dynamodb:Query');
    }
    if (resourceReq.permissions.includes('write')) {
      actions.push('dynamodb:PutItem');
    }

    policyGen.setActions(dynamoResource.id, actions);
    policyGen.setARN(dynamoResource.id, resourceReq.arn);
  }

  const generatedPolicy = policyGen.generatePolicy();
  
  // Return as API response
  const apiResponse = {
    success: true,
    policy: generatedPolicy,
    metadata: {
      statementCount: generatedPolicy.Statement.length,
      actionCount: generatedPolicy.Statement.reduce((acc, stmt) => {
        return acc + (Array.isArray(stmt.Action) ? stmt.Action.length : 1);
      }, 0),
    },
  };

  console.log('📤 API Response:');
  console.log(JSON.stringify(apiResponse, null, 2));
}

// Run the examples
if (typeof window === 'undefined') {
  // Node.js environment
  headlessExample();
  apiIntegrationExample();
} else {
  // Browser environment
  console.log('Run this example in Node.js to see the full output');
}

export { headlessExample, apiIntegrationExample };