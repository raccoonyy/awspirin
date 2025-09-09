"use client"

import { useState, useEffect, useCallback } from "react"
import { PolicyGenerator as LibraryPolicyGenerator } from "@/lib/policy-generator"
import { AWSResource, IAMPolicy } from "@/lib/types"
import { useTranslation } from "@/lib/i18n"
import { trackEvent } from "@/components/analytics"

// 현재 awspirin 앱 구조에 맞는 데이터 변환
const createAwspirinResources = (t: any): AWSResource[] => [
  {
    id: "s3",
    name: t('resources.services.s3.name') || 'S3',
    service: "s3",
    description: t('resources.services.s3.description') || 'Simple Storage Service',
    icon: "🪣",
    arnPattern: "arn:aws:s3:::*",
    actions: [
      {
        id: "s3:ListBucket",
        name: t('awsActions.s3.listObjects.name') || 'List Objects',
        description: t('awsActions.s3.listObjects.description') || 'List objects in bucket',
        category: "read",
        dependencies: ["s3:GetBucketLocation"],
        requiresARN: true,
      },
      {
        id: "s3:GetObject",
        name: t('awsActions.s3.readObjects.name') || 'Read Objects',
        description: t('awsActions.s3.readObjects.description') || 'Download and read objects',
        category: "read",
        dependencies: ["s3:ListBucket", "s3:GetBucketLocation"],
        requiresARN: true,
      },
      {
        id: "s3:PutObject",
        name: t('awsActions.s3.writeObjects.name') || 'Write Objects',
        description: t('awsActions.s3.writeObjects.description') || 'Upload and modify objects',
        category: "write",
        requiresARN: true,
      },
      {
        id: "s3:DeleteObject",
        name: t('awsActions.s3.deleteObjects.name') || 'Delete Objects',
        description: t('awsActions.s3.deleteObjects.description') || 'Delete objects from bucket',
        category: "write",
        dependencies: ["s3:ListBucket"],
        requiresARN: true,
      },
      {
        id: "s3:CreateBucket",
        name: t('awsActions.s3.manageBuckets.name') || 'Manage Buckets',
        description: t('awsActions.s3.manageBuckets.description') || 'Create and manage buckets',
        category: "admin",
        requiresARN: true,
      },
    ],
  },
  {
    id: "ec2",
    name: t('resources.services.ec2.name') || 'EC2',
    service: "ec2", 
    description: t('resources.services.ec2.description') || 'Elastic Compute Cloud',
    icon: "🖥️",
    arnPattern: "arn:aws:ec2:*:*:instance/*",
    actions: [
      {
        id: "ec2:DescribeInstances",
        name: t('awsActions.ec2.viewInstances.name') || 'View Instances',
        description: t('awsActions.ec2.viewInstances.description') || 'View instance details',
        category: "read",
        requiresARN: false,
      },
      {
        id: "ec2:StartInstances",
        name: t('awsActions.ec2.controlInstances.name') || 'Control Instances',
        description: t('awsActions.ec2.controlInstances.description') || 'Start, stop, reboot instances',
        category: "write",
        dependencies: ["ec2:DescribeInstances"],
        requiresARN: true,
      },
      {
        id: "ec2:StopInstances",
        name: "Stop Instances",
        description: "Stop running instances",
        category: "write",
        dependencies: ["ec2:DescribeInstances"],
        requiresARN: true,
      },
      {
        id: "ec2:TerminateInstances",
        name: t('awsActions.ec2.manageInstances.name') || 'Manage Instances',
        description: t('awsActions.ec2.manageInstances.description') || 'Launch and terminate instances',
        category: "admin",
        dependencies: ["ec2:DescribeInstances"],
        requiresARN: true,
      },
    ],
  },
  {
    id: "lambda",
    name: t('resources.services.lambda.name') || 'Lambda',
    service: "lambda",
    description: t('resources.services.lambda.description') || 'Serverless Functions',
    icon: "⚡",
    arnPattern: "arn:aws:lambda:*:*:function:*",
    actions: [
      {
        id: "lambda:GetFunction",
        name: t('awsActions.lambda.viewFunctions.name') || 'View Functions',
        description: t('awsActions.lambda.viewFunctions.description') || 'View function details',
        category: "read",
        requiresARN: true,
      },
      {
        id: "lambda:InvokeFunction",
        name: t('awsActions.lambda.executeFunctions.name') || 'Execute Functions',
        description: t('awsActions.lambda.executeFunctions.description') || 'Invoke Lambda functions',
        category: "write",
        dependencies: ["lambda:GetFunction"],
        requiresARN: true,
      },
      {
        id: "lambda:UpdateFunctionCode",
        name: t('awsActions.lambda.manageFunctions.name') || 'Manage Functions',
        description: t('awsActions.lambda.manageFunctions.description') || 'Create, update, delete functions',
        category: "admin",
        dependencies: ["lambda:GetFunction"],
        requiresARN: true,
      },
    ],
  },
  {
    id: "dynamodb",
    name: t('resources.services.dynamodb.name') || 'DynamoDB',
    service: "dynamodb",
    description: t('resources.services.dynamodb.description') || 'NoSQL Database',
    icon: "🗄️",
    arnPattern: "arn:aws:dynamodb:*:*:table/*",
    actions: [
      {
        id: "dynamodb:GetItem",
        name: t('awsActions.dynamodb.readData.name') || 'Read Data',
        description: t('awsActions.dynamodb.readData.description') || 'Read items from table',
        category: "read",
        requiresARN: true,
      },
      {
        id: "dynamodb:PutItem",
        name: t('awsActions.dynamodb.writeData.name') || 'Write Data',
        description: t('awsActions.dynamodb.writeData.description') || 'Add, update items',
        category: "write",
        requiresARN: true,
      },
      {
        id: "dynamodb:DeleteItem",
        name: t('awsActions.dynamodb.deleteData.name') || 'Delete Data',
        description: t('awsActions.dynamodb.deleteData.description') || 'Delete items from table',
        category: "write",
        requiresARN: true,
      },
      {
        id: "dynamodb:CreateTable",
        name: t('awsActions.dynamodb.manageTables.name') || 'Manage Tables',
        description: t('awsActions.dynamodb.manageTables.description') || 'Create, update, delete tables',
        category: "admin",
        requiresARN: false,
      },
    ],
  },
  {
    id: "cloudwatch",
    name: t('resources.services.cloudwatch.name') || 'CloudWatch',
    service: "cloudwatch",
    description: t('resources.services.cloudwatch.description') || 'Monitoring and Logging',
    icon: "📊",
    arnPattern: "arn:aws:logs:*:*:log-group:*",
    actions: [
      {
        id: "cloudwatch:GetMetricStatistics",
        name: t('awsActions.cloudwatch.viewMetrics.name') || 'View Metrics',
        description: t('awsActions.cloudwatch.viewMetrics.description') || 'View CloudWatch metrics',
        category: "read",
        requiresARN: false,
      },
      {
        id: "cloudwatch:PutMetricAlarm",
        name: t('awsActions.cloudwatch.manageAlarms.name') || 'Manage Alarms',
        description: t('awsActions.cloudwatch.manageAlarms.description') || 'Create and manage alarms',
        category: "write",
        requiresARN: false,
      },
      {
        id: "logs:CreateLogGroup",
        name: t('awsActions.cloudwatch.manageLogs.name') || 'Manage Logs',
        description: t('awsActions.cloudwatch.manageLogs.description') || 'Manage log groups and streams',
        category: "admin",
        requiresARN: false,
      },
    ],
  },
  {
    id: "sns",
    name: t('resources.services.sns.name') || 'SNS',
    service: "sns", 
    description: t('resources.services.sns.description') || 'Simple Notification Service',
    icon: "📢",
    arnPattern: "arn:aws:sns:*:*:*",
    actions: [
      {
        id: "sns:ListTopics",
        name: t('awsActions.sns.viewTopics.name') || 'View Topics',
        description: t('awsActions.sns.viewTopics.description') || 'View SNS topics',
        category: "read",
        requiresARN: false,
      },
      {
        id: "sns:Publish",
        name: t('awsActions.sns.publishMessages.name') || 'Publish Messages',
        description: t('awsActions.sns.publishMessages.description') || 'Publish messages to topics',
        category: "write",
        requiresARN: true,
      },
      {
        id: "sns:CreateTopic",
        name: t('awsActions.sns.manageTopics.name') || 'Manage Topics',
        description: t('awsActions.sns.manageTopics.description') || 'Create and manage topics',
        category: "admin",
        requiresARN: false,
      },
    ],
  },
  {
    id: "sqs",
    name: t('resources.services.sqs.name') || 'SQS',
    service: "sqs",
    description: t('resources.services.sqs.description') || 'Simple Queue Service', 
    icon: "📬",
    arnPattern: "arn:aws:sqs:*:*:*",
    actions: [
      {
        id: "sqs:GetQueueAttributes",
        name: t('awsActions.sqs.viewQueues.name') || 'View Queues',
        description: t('awsActions.sqs.viewQueues.description') || 'View queue details',
        category: "read",
        requiresARN: true,
      },
      {
        id: "sqs:SendMessage",
        name: t('awsActions.sqs.sendReceiveMessages.name') || 'Send/Receive Messages',
        description: t('awsActions.sqs.sendReceiveMessages.description') || 'Send and receive messages',
        category: "write",
        requiresARN: true,
      },
      {
        id: "sqs:CreateQueue",
        name: t('awsActions.sqs.manageQueues.name') || 'Manage Queues',
        description: t('awsActions.sqs.manageQueues.description') || 'Create and manage queues',
        category: "admin",
        requiresARN: false,
      },
    ],
  },
]

export function PolicyGeneratorWrapper() {
  const t = useTranslation()
  const [policy, setPolicy] = useState<IAMPolicy | null>(null)

  const resources = createAwspirinResources(t)

  const handlePolicyChange = useCallback((newPolicy: IAMPolicy) => {
    setPolicy(newPolicy)
    
    // Analytics tracking
    trackEvent('policy_generated', {
      statements_count: newPolicy.Statement.length,
      resources_count: newPolicy.Statement.reduce((acc, stmt) => {
        const resourceCount = Array.isArray(stmt.Resource) ? stmt.Resource.length : 1
        return acc + resourceCount
      }, 0),
      actions_count: newPolicy.Statement.reduce((acc, stmt) => {
        const actionCount = Array.isArray(stmt.Action) ? stmt.Action.length : 1
        return acc + actionCount
      }, 0)
    })
  }, [])

  const handleCopy = useCallback((policyString: string) => {
    trackEvent('policy_copied', {
      policy_size: policyString.length,
      statements_count: policy?.Statement?.length || 0
    })
  }, [policy])

  return (
    <div className="min-h-screen bg-gray-50">
      <LibraryPolicyGenerator
        services={resources}
        onChange={handlePolicyChange}
        onCopy={handleCopy}
        theme="light"
        layout="responsive"
        className="max-w-7xl mx-auto py-6"
        maxStatements={50}
        arnInputMode="both"
      />
    </div>
  )
}