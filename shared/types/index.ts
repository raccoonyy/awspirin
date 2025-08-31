// 공통 타입 정의
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

export interface PolicyStatement {
  Effect: "Allow" | "Deny"
  Action: string | string[]
  Resource: string | string[]
}

export interface IAMPolicy {
  Version: string
  Statement: PolicyStatement[]
}

export interface ARNConfig {
  arns: string[]
  allowCustomArn?: boolean
  groupByService?: boolean
}

export interface PolicyGeneratorConfig {
  theme?: "light" | "dark"
  language?: "ko" | "en"
  readonly?: boolean
  initialPolicy?: IAMPolicy
  arnList?: string[]
}