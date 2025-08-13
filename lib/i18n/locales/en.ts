import type { Translations } from '../types'

export const en: Translations = {
  common: {
    select: 'Select',
    selected: 'Selected',
    copy: 'Copy',
    copied: 'Copied',
    optional: 'Optional',
    all: 'All',
    none: 'None',
    search: 'Search',
    clear: 'Clear',
    apply: 'Apply',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info'
  },

  header: {
    title: 'AWSpirin',
    subtitle: 'IAM policy generator that automatically includes dependencies',
    githubIssue: 'For bug reports or feature requests, please use [GitHub Issues](https://github.com/raccoonyy/awspirin/issues/new)'
  },

  hero: {
    mainTitle: 'WITHOUT HEADACHES',
    subTitle: 'Easy generate AWS IAM policies with just clicks'
  },

  footer: {
    githubIssue: 'For bug reports or feature requests, please use [GitHub Issues](https://github.com/raccoonyy/awspirin/issues/new)'
  },

  resources: {
    title: 'Select AWS Resources',
    subtitle: 'Choose the AWS services to apply the policy to.',
    selectedCount: '{count} selected',
    services: {
      s3: {
        name: 'S3 (Simple Storage Service)',
        description: 'Object storage service'
      },
      ec2: {
        name: 'EC2 (Elastic Compute Cloud)',
        description: 'Virtual server instances'
      },
      lambda: {
        name: 'Lambda',
        description: 'Serverless computing service'
      },
      dynamodb: {
        name: 'DynamoDB',
        description: 'NoSQL database service'
      },
      cloudwatch: {
        name: 'CloudWatch',
        description: 'Monitoring and logging service'
      },
      sns: {
        name: 'SNS (Simple Notification Service)',
        description: 'Message notification service'
      },
      sqs: {
        name: 'SQS (Simple Queue Service)',
        description: 'Message queue service'
      }
    }
  },

  actions: {
    title: 'Select Actions',
    subtitle: 'Choose the required permissions for selected resources.',
    selectedCount: '{count} selected',
    selectResource: 'Please select a resource first.',
    arnLabel: 'ARN (Optional)',
    arnPlaceholder: {
      s3: 'S3 bucket ARN applies permissions to both bucket and objects (/*)',
      ec2: 'Enter EC2 instance ARN',
      lambda: 'Enter Lambda function ARN',
      dynamodb: 'DynamoDB table ARN applies permissions to both table and indexes (/*)',
      cloudwatch: 'CloudWatch log group ARN applies permissions to both log group and streams (:*)',
      sns: 'Enter SNS topic ARN',
      sqs: 'Enter SQS queue ARN',
      default: 'Leave empty to apply to all resources (*)'
    },
    arnHelp: {
      s3: 'arn:aws:s3:::<bucket-name>',
      ec2: 'arn:aws:ec2:<region>:<account-id>:instance/<instance-id>',
      lambda: 'arn:aws:lambda:<region>:<account-id>:function:<function-name>',
      dynamodb: 'arn:aws:dynamodb:<region>:<account-id>:table/<table-name>',
      cloudwatch: 'arn:aws:logs:<region>:<account-id>:log-group:<log-group-name>',
      sns: 'arn:aws:sns:<region>:<account-id>:<topic-name>',
      sqs: 'arn:aws:sqs:<region>:<account-id>:<queue-name>',
      default: 'arn:aws:{service}:<region>:<account-id>:resource'
    },
    categories: {
      read: 'Read Permissions',
      write: 'Write Permissions',
      admin: 'Admin Permissions'
    },
    actionsSelected: '{selected}/{total} actions selected'
  },

  policy: {
    title: 'Generated Policy',
    valid: 'Valid Policy',
    selectActions: 'Please select actions.',
    noActionsSelected: 'Select actions to generate policy',
    copyTooltip: 'Copy to clipboard',
    summary: {
      totalActions: 'Total {count} actions selected',
      awsActions: '{count} AWS actions included',
      statements: '{count} statements generated',
      resources: {
        label: 'Resources',
        allResources: 'All resources (*)',
        specificArn: 'Specific ARN',
        mixed: 'All resources (*) + Specific ARN',
        none: 'None'
      }
    }
  },

  awsActions: {
    s3: {
      listObjects: {
        name: 'List Objects',
        description: 'List objects in S3 bucket'
      },
      readObjects: {
        name: 'Read Objects',
        description: 'Read objects from S3 bucket'
      },
      writeObjects: {
        name: 'Upload/Modify Objects',
        description: 'Upload and modify objects in S3 bucket'
      },
      deleteObjects: {
        name: 'Delete Objects',
        description: 'Delete objects from S3 bucket'
      },
      manageBuckets: {
        name: 'Manage Buckets',
        description: 'Create, delete, and configure S3 buckets'
      }
    },
    ec2: {
      viewInstances: {
        name: 'View Instances',
        description: 'View EC2 instance information'
      },
      controlInstances: {
        name: 'Control Instances',
        description: 'Start, stop, and restart EC2 instances'
      },
      manageInstances: {
        name: 'Manage Instances',
        description: 'Create and terminate EC2 instances'
      }
    },
    lambda: {
      viewFunctions: {
        name: 'View Functions',
        description: 'List and view Lambda function information'
      },
      invokeFunctions: {
        name: 'Invoke Functions',
        description: 'Execute Lambda functions'
      },
      manageFunctions: {
        name: 'Manage Functions',
        description: 'Create, modify, and delete Lambda functions'
      }
    },
    dynamodb: {
      readData: {
        name: 'Read Data',
        description: 'Read and query data from DynamoDB tables'
      },
      writeData: {
        name: 'Write Data',
        description: 'Create and modify data in DynamoDB tables'
      },
      deleteData: {
        name: 'Delete Data',
        description: 'Delete data from DynamoDB tables'
      },
      manageTables: {
        name: 'Manage Tables',
        description: 'Create, modify, and delete DynamoDB tables'
      }
    },
    sns: {
      publishMessages: {
        name: 'Publish Messages',
        description: 'Publish messages to SNS topics'
      },
      manageSubscriptions: {
        name: 'Manage Subscriptions',
        description: 'Manage SNS topic subscriptions'
      },
      manageTopics: {
        name: 'Manage Topics',
        description: 'Create, modify, and delete SNS topics'
      }
    },
    cloudwatch: {
      viewMetrics: {
        name: 'View Metrics',
        description: 'View CloudWatch metrics'
      },
      manageAlarms: {
        name: 'Manage Alarms',
        description: 'Create, modify, and delete CloudWatch alarms'
      },
      manageLogs: {
        name: 'Manage Logs',
        description: 'Manage CloudWatch logs'
      }
    },
    sqs: {
      receiveMessages: {
        name: 'Receive Messages',
        description: 'Receive and delete messages from SQS queues'
      },
      sendMessages: {
        name: 'Send Messages',
        description: 'Send messages to SQS queues'
      },
      manageQueues: {
        name: 'Manage Queues',
        description: 'Create, modify, and delete SQS queues'
      }
    }
  }
}