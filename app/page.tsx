"use client"

import { useState } from "react"
import { ResourceSelector } from "@/components/resource-selector"
import { ActionSelector } from "@/components/action-selector"
import { PolicyPreview } from "@/components/policy-preview"

export interface AWSResource {
  id: string
  name: string
  description: string
  icon: string
  selected: boolean
  arn?: string
}

export interface AWSAction {
  id: string
  name: string
  description: string
  category: "read" | "write" | "admin"
  actions: string[]  // 실제 AWS 액션 코드들
  dependencies?: string[]  // 의존성 액션들
  selected: boolean
}

const initialResources: AWSResource[] = [
  {
    id: "s3",
    name: "S3 (Simple Storage Service)",
    description: "객체 스토리지 서비스",
    icon: "🪣",
    selected: false,
  },
  {
    id: "ec2",
    name: "EC2 (Elastic Compute Cloud)",
    description: "가상 서버 인스턴스",
    icon: "🖥️",
    selected: false,
  },
  {
    id: "lambda",
    name: "Lambda",
    description: "서버리스 컴퓨팅 서비스",
    icon: "⚡",
    selected: false,
  },
  {
    id: "dynamodb",
    name: "DynamoDB",
    description: "NoSQL 데이터베이스 서비스",
    icon: "🗄️",
    selected: false,
  },

  {
    id: "cloudwatch",
    name: "CloudWatch",
    description: "모니터링 및 로깅 서비스",
    icon: "📊",
    selected: false,
  },
  {
    id: "sns",
    name: "SNS (Simple Notification Service)",
    description: "메시지 알림 서비스",
    icon: "📢",
    selected: false,
  },
  {
    id: "sqs",
    name: "SQS (Simple Queue Service)",
    description: "메시지 큐 서비스",
    icon: "📬",
    selected: false,
  },


]

const resourceActions: Record<string, AWSAction[]> = {
  s3: [
    {
      id: "s3-list-objects",
      name: "객체 목록 조회",
      description: "S3 버킷의 객체 목록을 조회합니다",
      category: "read",
      actions: ["s3:ListBucket"],
      dependencies: ["s3:GetBucketLocation"],
      selected: false,
    },
    {
      id: "s3-read-objects",
      name: "객체 읽기",
      description: "S3 버킷에서 객체를 읽습니다",
      category: "read",
      actions: ["s3:GetObject"],
      dependencies: ["s3:ListBucket", "s3:GetBucketLocation"],
      selected: false,
    },
    {
      id: "s3-write-objects",
      name: "객체 업로드/수정",
      description: "S3 버킷에 객체를 업로드하고 수정합니다",
      category: "write",
      actions: ["s3:PutObject", "s3:PutObjectAcl"],
      selected: false,
    },
    {
      id: "s3-delete-objects",
      name: "객체 삭제",
      description: "S3 버킷에서 객체를 삭제합니다",
      category: "write",
      actions: ["s3:DeleteObject"],
      dependencies: ["s3:ListBucket"],
      selected: false,
    },
    {
      id: "s3-manage-buckets",
      name: "버킷 관리",
      description: "S3 버킷을 생성, 삭제, 설정합니다",
      category: "admin",
      actions: ["s3:CreateBucket", "s3:DeleteBucket", "s3:PutBucketPolicy", "s3:GetBucketPolicy"],
      selected: false,
    },
  ],
  ec2: [
    {
      id: "ec2-view-instances",
      name: "인스턴스 조회",
      description: "EC2 인스턴스 정보를 조회합니다",
      category: "read",
      actions: ["ec2:DescribeInstances", "ec2:DescribeInstanceStatus"],
      selected: false,
    },
    {
      id: "ec2-control-instances",
      name: "인스턴스 제어",
      description: "EC2 인스턴스를 시작, 중지, 재시작합니다",
      category: "write",
      actions: ["ec2:StartInstances", "ec2:StopInstances", "ec2:RebootInstances"],
      dependencies: ["ec2:DescribeInstances"],
      selected: false,
    },
    {
      id: "ec2-manage-instances",
      name: "인스턴스 관리",
      description: "EC2 인스턴스를 생성, 종료합니다",
      category: "admin",
      actions: ["ec2:RunInstances", "ec2:TerminateInstances"],
      dependencies: ["ec2:DescribeInstances", "ec2:DescribeImages", "ec2:DescribeSecurityGroups"],
      selected: false,
    },
  ],
  lambda: [
    {
      id: "lambda-view-functions",
      name: "함수 조회",
      description: "Lambda 함수 목록과 정보를 조회합니다",
      category: "read",
      actions: ["lambda:ListFunctions", "lambda:GetFunction"],
      selected: false,
    },
    {
      id: "lambda-invoke-functions",
      name: "함수 실행",
      description: "Lambda 함수를 실행합니다",
      category: "write",
      actions: ["lambda:InvokeFunction"],
      dependencies: ["lambda:GetFunction"],
      selected: false,
    },
    {
      id: "lambda-manage-functions",
      name: "함수 관리",
      description: "Lambda 함수를 생성, 수정, 삭제합니다",
      category: "admin",
      actions: ["lambda:CreateFunction", "lambda:UpdateFunctionCode", "lambda:DeleteFunction"],
      dependencies: ["iam:PassRole"],
      selected: false,
    },
  ],
  dynamodb: [
    {
      id: "dynamodb-read-data",
      name: "데이터 읽기",
      description: "DynamoDB 테이블에서 데이터를 읽고 쿼리합니다",
      category: "read",
      actions: ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan"],
      selected: false,
    },
    {
      id: "dynamodb-write-data",
      name: "데이터 쓰기",
      description: "DynamoDB 테이블에 데이터를 생성, 수정합니다",
      category: "write",
      actions: ["dynamodb:PutItem", "dynamodb:UpdateItem"],
      selected: false,
    },
    {
      id: "dynamodb-delete-data",
      name: "데이터 삭제",
      description: "DynamoDB 테이블에서 데이터를 삭제합니다",
      category: "write",
      actions: ["dynamodb:DeleteItem"],
      selected: false,
    },
    {
      id: "dynamodb-manage-tables",
      name: "테이블 관리",
      description: "DynamoDB 테이블을 생성, 수정, 삭제합니다",
      category: "admin",
      actions: ["dynamodb:CreateTable", "dynamodb:UpdateTable", "dynamodb:DeleteTable", "dynamodb:DescribeTable"],
      selected: false,
    },
  ],
  sns: [
    {
      id: "sns-publish-messages",
      name: "메시지 발행",
      description: "SNS 토픽에 메시지를 발행합니다",
      category: "write",
      actions: ["sns:Publish"],
      dependencies: ["sns:GetTopicAttributes"],
      selected: false,
    },
    {
      id: "sns-manage-subscriptions",
      name: "구독 관리",
      description: "SNS 토픽의 구독을 관리합니다",
      category: "write",
      actions: ["sns:Subscribe", "sns:Unsubscribe", "sns:ConfirmSubscription"],
      dependencies: ["sns:ListSubscriptionsByTopic"],
      selected: false,
    },
    {
      id: "sns-manage-topics",
      name: "토픽 관리",
      description: "SNS 토픽을 생성, 수정, 삭제합니다",
      category: "admin",
      actions: ["sns:CreateTopic", "sns:DeleteTopic", "sns:SetTopicAttributes"],
      selected: false,
    },
  ],
  cloudwatch: [
    {
      id: "cloudwatch-view-metrics",
      name: "메트릭 조회",
      description: "CloudWatch 메트릭을 조회합니다",
      category: "read",
      actions: ["cloudwatch:GetMetricStatistics", "cloudwatch:ListMetrics"],
      selected: false,
    },
    {
      id: "cloudwatch-manage-alarms",
      name: "알람 관리",
      description: "CloudWatch 알람을 생성, 수정, 삭제합니다",
      category: "write",
      actions: ["cloudwatch:PutMetricAlarm", "cloudwatch:DeleteAlarms"],
      dependencies: ["cloudwatch:DescribeAlarms"],
      selected: false,
    },
    {
      id: "cloudwatch-manage-logs",
      name: "로그 관리",
      description: "CloudWatch 로그를 관리합니다",
      category: "write",
      actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      selected: false,
    },
  ],
  sqs: [
    {
      id: "sqs-receive-messages",
      name: "메시지 수신",
      description: "SQS 큐에서 메시지를 수신하고 삭제합니다",
      category: "read",
      actions: ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
      selected: false,
    },
    {
      id: "sqs-send-messages",
      name: "메시지 전송",
      description: "SQS 큐에 메시지를 전송합니다",
      category: "write",
      actions: ["sqs:SendMessage", "sqs:GetQueueUrl"],
      selected: false,
    },
    {
      id: "sqs-manage-queues",
      name: "큐 관리",
      description: "SQS 큐를 생성, 수정, 삭제합니다",
      category: "admin",
      actions: ["sqs:CreateQueue", "sqs:DeleteQueue", "sqs:SetQueueAttributes"],
      selected: false,
    },
  ],
}

export default function AWSPolicyGenerator() {
  const [resources, setResources] = useState<AWSResource[]>(initialResources)
  const [actions, setActions] = useState<Record<string, AWSAction[]>>(resourceActions)

  const selectedResources = resources.filter((r) => r.selected)
  const selectedActions = Object.values(actions)
    .flat()
    .filter((a) => a.selected)
  
  // 선택된 작업들로부터 실제 AWS 액션 코드들을 추출
  const getAllAwsActions = () => {
    const awsActions = new Set<string>()
    
    selectedActions.forEach(action => {
      // 메인 액션들 추가
      action.actions.forEach(awsAction => awsActions.add(awsAction))
      
      // 의존성 액션들 추가
      if (action.dependencies) {
        action.dependencies.forEach(dep => awsActions.add(dep))
      }
    })
    
    return Array.from(awsActions).sort()
  }

  // ARN 유효성 검사
  const isValidArn = (arn: string) => {
    if (!arn.trim()) return false
    // 기본 ARN 형식: arn:partition:service:region:account-id:resource
    const arnPattern = /^arn:[^:]+:[^:]+:[^:]*:[^:]*:.+$/
    return arnPattern.test(arn.trim())
  }

  // 서비스별 ARN 처리 함수
  const processServiceArn = (serviceId: string, arn: string) => {
    const arns: string[] = []
    
    switch (serviceId) {
      case 's3':
        return processS3Arn(arn)
      case 'dynamodb':
        return processDynamoDBArn(arn)
      case 'cloudwatch':
        return processCloudWatchArn(arn)
      default:
        arns.push(arn)
        return arns
    }
  }

  // S3 ARN을 처리하는 함수
  const processS3Arn = (arn: string) => {
    const arns: string[] = []
    
    // S3 ARN 형식 확인 및 수정
    // 잘못된 형식: arn:aws:s3:region:account:bucket-name
    // 올바른 형식: arn:aws:s3:::bucket-name
    let correctedArn = arn
    if (arn.match(/^arn:aws:s3:[^:]*:[^:]*:[^/]+$/)) {
      // 잘못된 S3 ARN 형식을 올바른 형식으로 변환
      const parts = arn.split(':')
      if (parts.length >= 6) {
        correctedArn = `arn:aws:s3:::${parts[5]}`
      }
    }
    
    // 버킷 ARN인지 확인 (arn:aws:s3:::bucket-name 형태)
    if (correctedArn.match(/^arn:aws:s3:::[^/]+$/)) {
      // 버킷 ARN이면 버킷과 객체 ARN 모두 추가
      arns.push(correctedArn) // 버킷 자체
      arns.push(`${correctedArn}/*`) // 버킷 내 모든 객체
    } else if (correctedArn.match(/^arn:aws:s3:::[^/]+\/.*$/)) {
      // 이미 객체 ARN이면 그대로 사용
      arns.push(correctedArn)
      // 버킷 ARN도 추가 (ListBucket 등을 위해)
      const bucketArn = correctedArn.split('/')[0]
      arns.push(bucketArn)
    } else {
      // 다른 형태면 그대로 사용
      arns.push(correctedArn)
    }
    
    return arns
  }

  // DynamoDB ARN을 처리하는 함수
  const processDynamoDBArn = (arn: string) => {
    const arns: string[] = []
    
    // 테이블 ARN인지 확인 (arn:aws:dynamodb:region:account:table/table-name)
    if (arn.match(/^arn:aws:dynamodb:[^:]+:[^:]+:table\/[^/]+$/)) {
      // 테이블 ARN이면 테이블과 인덱스 ARN 모두 추가
      arns.push(arn) // 테이블 자체
      arns.push(`${arn}/*`) // 테이블의 모든 인덱스
    } else {
      // 다른 형태면 그대로 사용
      arns.push(arn)
    }
    
    return arns
  }

  // CloudWatch ARN을 처리하는 함수
  const processCloudWatchArn = (arn: string) => {
    const arns: string[] = []
    
    // 로그 그룹 ARN인지 확인 (arn:aws:logs:region:account:log-group:log-group-name)
    if (arn.match(/^arn:aws:logs:[^:]+:[^:]+:log-group:[^:]+$/)) {
      // 로그 그룹 ARN이면 로그 그룹과 스트림 ARN 모두 추가
      arns.push(arn) // 로그 그룹 자체
      arns.push(`${arn}:*`) // 로그 그룹의 모든 스트림
    } else {
      // 다른 형태면 그대로 사용
      arns.push(arn)
    }
    
    return arns
  }

  // 리소스별로 분리된 정책 정보 생성
  const getPolicyStatements = () => {
    if (selectedActions.length === 0) {
      return []
    }

    const statements: any[] = []
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
        // 해당 리소스의 액션만 필터링
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
        // ARN이 없는 리소스들의 액션만 필터링
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

  // 기존 함수들 (하위 호환성을 위해 유지)
  const getPolicyResources = () => {
    const statements = getPolicyStatements()
    if (statements.length === 0) return "*"
    if (statements.length === 1) return statements[0].Resource
    return statements.map(s => s.Resource).flat()
  }

  const handleResourceToggle = (resourceId: string) => {
    const resource = resources.find((r) => r.id === resourceId)
    const isCurrentlySelected = resource?.selected
    
    setResources((prev) => prev.map((r) => (r.id === resourceId ? { ...r, selected: !r.selected } : r)))

    // GTM 이벤트 전송
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'resource_toggle',
        resource_id: resourceId,
        resource_name: resource?.name,
        action: isCurrentlySelected ? 'deselect' : 'select'
      })
    }

    // 리소스가 선택 해제되면 해당 리소스의 모든 액션도 해제
    if (isCurrentlySelected) {
      setActions((prev) => ({
        ...prev,
        [resourceId]: prev[resourceId]?.map((a) => ({ ...a, selected: false })) || [],
      }))
    }
  }

  const handleActionToggle = (resourceId: string, actionId: string) => {
    const action = actions[resourceId]?.find((a) => a.id === actionId)
    const isCurrentlySelected = action?.selected
    
    setActions((prev) => ({
      ...prev,
      [resourceId]: prev[resourceId]?.map((a) => (a.id === actionId ? { ...a, selected: !a.selected } : a)) || [],
    }))

    // GTM 이벤트 전송
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'action_toggle',
        resource_id: resourceId,
        action_id: actionId,
        action_name: action?.name,
        action_category: action?.category,
        action: isCurrentlySelected ? 'deselect' : 'select'
      })
    }
  }

  const handleCategoryToggle = (resourceId: string, category: string, selected: boolean) => {
    setActions((prev) => ({
      ...prev,
      [resourceId]: prev[resourceId]?.map((a) => (a.category === category ? { ...a, selected } : a)) || [],
    }))
  }

  const handleResourceActionsToggle = (resourceId: string, selected: boolean) => {
    setActions((prev) => ({
      ...prev,
      [resourceId]: prev[resourceId]?.map((a) => ({ ...a, selected })) || [],
    }))
  }

  const handleResourceArnChange = (resourceId: string, arn: string) => {
    setResources((prev) => prev.map((r) => (r.id === resourceId ? { ...r, arn } : r)))

    // ARN 입력 이벤트 전송 (빈 값이 아닐 때만)
    if (arn.trim() && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'arn_input',
        resource_id: resourceId,
        arn_length: arn.length,
        has_valid_arn: isValidArn(arn)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">AWS IAM Policy Generator</h1>
          <p className="text-sm text-gray-600 mt-1">시각적으로 AWS IAM 정책을 생성하고 관리하세요.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-10 gap-6 min-h-[800px]">
          {/* 리소스 선택 패널 (30%) */}
          <div className="col-span-3">
            <ResourceSelector resources={resources} onResourceToggle={handleResourceToggle} />
          </div>

          {/* 액션 선택 패널 (40%) */}
          <div className="col-span-4">
            <ActionSelector
              selectedResources={selectedResources}
              actions={actions}
              onActionToggle={handleActionToggle}
              onCategoryToggle={handleCategoryToggle}
              onResourceActionsToggle={handleResourceActionsToggle}
              onResourceArnChange={handleResourceArnChange}
            />
          </div>

          {/* 정책 미리보기 패널 (30%) */}
          <div className="col-span-3">
            <PolicyPreview 
              selectedResources={selectedResources} 
              selectedActions={selectedActions} 
              getAllAwsActions={getAllAwsActions}
              getPolicyResources={getPolicyResources}
              getPolicyStatements={getPolicyStatements}
            />
          </div>
        </div>
      </main>
    </div>
  )
}