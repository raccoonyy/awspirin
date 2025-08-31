import type { AWSResource, AWSAction, PolicyStatement, IAMPolicy } from '../types'

// ARN 유효성 검사
export const isValidArn = (arn: string): boolean => {
  if (!arn.trim()) return false
  const arnPattern = /^arn:[^:]+:[^:]+:[^:]*:[^:]*:.+$/
  return arnPattern.test(arn.trim())
}

// 서비스별 ARN 처리
export const processServiceArn = (serviceId: string, arn: string): string[] => {
  const arns: string[] = []

  switch (serviceId) {
    case 's3':
      return processS3Arn(arn)
    case 'dynamodb':
      return processDynamoDBArn(arn)
    case 'cloudwatch':
      return processCloudWatchArn(arn)
    case 'ec2':
      return processEC2Arn(arn)
    case 'lambda':
      return processLambdaArn(arn)
    case 'sns':
      return processSNSArn(arn)
    case 'sqs':
      return processSQSArn(arn)
    default:
      arns.push(arn)
      return arns
  }
}

// S3 ARN 처리
const processS3Arn = (arn: string): string[] => {
  const arns: string[] = []
  let correctedArn = arn

  if (arn.match(/^arn:aws:s3:[^:]*:[^:]*:[^/]+$/)) {
    const parts = arn.split(':')
    if (parts.length >= 6) {
      correctedArn = `arn:aws:s3:::${parts[5]}`
    }
  }

  if (correctedArn.match(/^arn:aws:s3:::[^/]+$/)) {
    arns.push(correctedArn)
    arns.push(`${correctedArn}/*`)
  } else if (correctedArn.match(/^arn:aws:s3:::[^/]+\/.*$/)) {
    arns.push(correctedArn)
    const bucketArn = correctedArn.split('/')[0]
    arns.push(bucketArn)
  } else {
    arns.push(correctedArn)
  }

  return arns
}

// DynamoDB ARN 처리
const processDynamoDBArn = (arn: string): string[] => {
  const arns: string[] = []

  if (arn.match(/^arn:aws:dynamodb:[^:]+:[^:]+:table\/[^/]+$/)) {
    arns.push(arn)
    arns.push(`${arn}/*`)
  } else {
    arns.push(arn)
  }

  return arns
}

// CloudWatch ARN 처리
const processCloudWatchArn = (arn: string): string[] => {
  const arns: string[] = []

  if (arn.match(/^arn:aws:logs:[^:]+:[^:]+:log-group:[^:]+$/)) {
    arns.push(arn)
    arns.push(`${arn}:*`)
  } else {
    arns.push(arn)
  }

  return arns
}

// EC2 ARN 처리
const processEC2Arn = (arn: string): string[] => {
  return [arn]
}

// Lambda ARN 처리
const processLambdaArn = (arn: string): string[] => {
  const arns: string[] = []

  if (arn.match(/^arn:aws:lambda:[^:]+:[^:]+:function:[^:]+$/)) {
    arns.push(arn)
    arns.push(`${arn}:*`)
  } else {
    arns.push(arn)
  }

  return arns
}

// SNS ARN 처리
const processSNSArn = (arn: string): string[] => {
  return [arn]
}

// SQS ARN 처리
const processSQSArn = (arn: string): string[] => {
  return [arn]
}

// 선택된 액션들로부터 AWS 액션 코드 추출
export const getAllAwsActions = (selectedActions: AWSAction[]): string[] => {
  const awsActions = new Set<string>()

  selectedActions.forEach(action => {
    action.actions.forEach(awsAction => awsActions.add(awsAction))
    if (action.dependencies) {
      action.dependencies.forEach(dep => awsActions.add(dep))
    }
  })

  return Array.from(awsActions).sort()
}

// 정책 스테이트먼트 생성
export const generatePolicyStatements = (
  selectedResources: AWSResource[],
  selectedActions: AWSAction[],
  actions: Record<string, AWSAction[]>
): PolicyStatement[] => {
  if (selectedActions.length === 0) {
    return []
  }

  const statements: PolicyStatement[] = []
  const resourcesWithArn: AWSResource[] = []
  const resourcesWithoutArn: AWSResource[] = []

  // ARN이 있는 리소스와 없는 리소스 분리
  selectedResources.forEach(resource => {
    if (resource.arn && isValidArn(resource.arn)) {
      resourcesWithArn.push(resource)
    } else {
      resourcesWithoutArn.push(resource)
    }
  })

  // ARN이 있는 리소스들에 대해 각각 별도 Statement 생성
  resourcesWithArn.forEach(resource => {
    const resourceActions = selectedActions.filter(action => {
      return actions[resource.id]?.some(a => a.id === action.id && a.selected)
    })

    if (resourceActions.length > 0) {
      const resourceAwsActions = new Set<string>()
      resourceActions.forEach(action => {
        action.actions.forEach(awsAction => resourceAwsActions.add(awsAction))
        if (action.dependencies) {
          action.dependencies.forEach(dep => resourceAwsActions.add(dep))
        }
      })

      const trimmedArn = resource.arn!.trim()
      const processedArns = processServiceArn(resource.id, trimmedArn)

      statements.push({
        Effect: "Allow",
        Action: Array.from(resourceAwsActions).sort(),
        Resource: processedArns.length === 1 ? processedArns[0] : processedArns
      })
    }
  })

  // ARN이 없는 리소스들에 대해 하나의 Statement 생성
  if (resourcesWithoutArn.length > 0) {
    const wildcardActions = selectedActions.filter(action => {
      return resourcesWithoutArn.some(resource =>
        actions[resource.id]?.some(a => a.id === action.id && a.selected)
      )
    })

    if (wildcardActions.length > 0) {
      const wildcardAwsActions = new Set<string>()
      wildcardActions.forEach(action => {
        action.actions.forEach(awsAction => wildcardAwsActions.add(awsAction))
        if (action.dependencies) {
          action.dependencies.forEach(dep => wildcardAwsActions.add(dep))
        }
      })

      statements.push({
        Effect: "Allow",
        Action: Array.from(wildcardAwsActions).sort(),
        Resource: "*"
      })
    }
  }

  return statements
}

// 완전한 IAM 정책 생성
export const generateIAMPolicy = (
  selectedResources: AWSResource[],
  selectedActions: AWSAction[],
  actions: Record<string, AWSAction[]>
): IAMPolicy | null => {
  const statements = generatePolicyStatements(selectedResources, selectedActions, actions)
  
  if (statements.length === 0) {
    return null
  }

  return {
    Version: "2012-10-17",
    Statement: statements,
  }
}