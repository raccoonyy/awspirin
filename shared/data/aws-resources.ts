import type { AWSResource } from '../types'

// 다국어 지원을 위한 리소스 데이터 생성 함수
export const createAWSResources = (t: (key: string) => string): AWSResource[] => [
  {
    id: "s3",
    name: t('resources.services.s3.name') || 'Amazon S3',
    description: t('resources.services.s3.description') || 'Object storage service',
    icon: "🪣",
    selected: false,
  },
  {
    id: "ec2",
    name: t('resources.services.ec2.name') || 'Amazon EC2',
    description: t('resources.services.ec2.description') || 'Virtual servers in the cloud',
    icon: "🖥️",
    selected: false,
  },
  {
    id: "lambda",
    name: t('resources.services.lambda.name') || 'AWS Lambda',
    description: t('resources.services.lambda.description') || 'Run code without servers',
    icon: "⚡",
    selected: false,
  },
  {
    id: "dynamodb",
    name: t('resources.services.dynamodb.name') || 'Amazon DynamoDB',
    description: t('resources.services.dynamodb.description') || 'NoSQL database service',
    icon: "🗄️",
    selected: false,
  },
  {
    id: "cloudwatch",
    name: t('resources.services.cloudwatch.name') || 'Amazon CloudWatch',
    description: t('resources.services.cloudwatch.description') || 'Monitoring and observability',
    icon: "📊",
    selected: false,
  },
  {
    id: "sns",
    name: t('resources.services.sns.name') || 'Amazon SNS',
    description: t('resources.services.sns.description') || 'Notification service',
    icon: "📢",
    selected: false,
  },
  {
    id: "sqs",
    name: t('resources.services.sqs.name') || 'Amazon SQS',
    description: t('resources.services.sqs.description') || 'Message queuing service',
    icon: "📬",
    selected: false,
  },
]

// 기본 리소스 데이터 (번역 없이)
export const defaultAWSResources: AWSResource[] = [
  {
    id: "s3",
    name: "Amazon S3",
    description: "Object storage service",
    icon: "🪣",
    selected: false,
  },
  {
    id: "ec2",
    name: "Amazon EC2",
    description: "Virtual servers in the cloud",
    icon: "🖥️",
    selected: false,
  },
  {
    id: "lambda",
    name: "AWS Lambda",
    description: "Run code without servers",
    icon: "⚡",
    selected: false,
  },
  {
    id: "dynamodb",
    name: "Amazon DynamoDB",
    description: "NoSQL database service",
    icon: "🗄️",
    selected: false,
  },
  {
    id: "cloudwatch",
    name: "Amazon CloudWatch",
    description: "Monitoring and observability",
    icon: "📊",
    selected: false,
  },
  {
    id: "sns",
    name: "Amazon SNS",
    description: "Notification service",
    icon: "📢",
    selected: false,
  },
  {
    id: "sqs",
    name: "Amazon SQS",
    description: "Message queuing service",
    icon: "📬",
    selected: false,
  },
]