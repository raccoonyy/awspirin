import React from 'react';
import { PolicyGenerator, ARNItem } from '../src';

const BasicUsageExample: React.FC = () => {
  // Example ARN list that would be provided by the user
  const arnList: ARNItem[] = [
    {
      arn: 'arn:aws:s3:::my-app-bucket/*',
      service: 's3',
      displayName: 'My App Bucket',
      description: 'Main application storage bucket',
      tags: { Environment: 'production', Project: 'my-app' },
    },
    {
      arn: 'arn:aws:s3:::my-logs-bucket/*',
      service: 's3',
      displayName: 'Logs Bucket',
      description: 'Application logs storage',
      tags: { Environment: 'production', Type: 'logs' },
    },
    {
      arn: 'arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0',
      service: 'ec2',
      displayName: 'Web Server Instance',
      description: 'Main web server',
      tags: { Environment: 'production', Role: 'web' },
    },
    {
      arn: 'arn:aws:lambda:us-west-2:123456789012:function:process-data',
      service: 'lambda',
      displayName: 'Data Processing Function',
      description: 'Processes incoming data',
      tags: { Environment: 'production', Type: 'processor' },
    },
    {
      arn: 'arn:aws:dynamodb:us-east-1:123456789012:table/Users',
      service: 'dynamodb',
      displayName: 'Users Table',
      description: 'User account information',
      tags: { Environment: 'production', Type: 'user-data' },
    },
  ];

  const handlePolicyChange = (policy: any) => {
    console.log('Policy changed:', JSON.stringify(policy, null, 2));
  };

  const handleCopy = (policy: string) => {
    console.log('Policy copied to clipboard');
  };

  const handleARNSelect = (resourceId: string, arn: string) => {
    console.log(`ARN selected for ${resourceId}:`, arn);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AWS IAM Policy Generator - Basic Usage</h1>
      <p>This example shows the basic usage of the PolicyGenerator component with ARN dropdown functionality.</p>
      
      <PolicyGenerator
        arnList={arnList}
        arnInputMode="auto" // Auto-detects: dropdown when ARNs available, input otherwise
        theme="light"
        layout="responsive" // Responsive layout that adapts to screen size
        breakpoint={768}
        onChange={handlePolicyChange}
        onCopy={handleCopy}
        onARNSelect={handleARNSelect}
        maxStatements={20}
        allowWildcards={true}
      />
    </div>
  );
};

export default BasicUsageExample;