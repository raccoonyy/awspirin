// 지원하는 언어 타입
export type Locale = 'ko' | 'en' | 'ja' | 'zh'

// 번역 키 타입 정의
export interface Translations {
  // 공통 UI 요소
  common: {
    select: string
    selected: string
    copy: string
    copied: string
    optional: string
    all: string
    none: string
    search: string
    clear: string
    apply: string
    cancel: string
    save: string
    delete: string
    edit: string
    close: string
    loading: string
    error: string
    success: string
    warning: string
    info: string
  }

  // 헤더 및 메인 타이틀
  header: {
    title: string
    subtitle: string
    githubIssue: string
  }

  // 히어로 섹션
  hero: {
    mainTitle: string
    subTitle: string
  }

  // 푸터
  footer: {
    githubIssue: string
  }

  // 리소스 선택 섹션
  resources: {
    title: string
    subtitle: string
    selectedCount: string // "{count}개 선택됨"
    services: {
      s3: {
        name: string
        description: string
      }
      ec2: {
        name: string
        description: string
      }
      lambda: {
        name: string
        description: string
      }
      dynamodb: {
        name: string
        description: string
      }
      cloudwatch: {
        name: string
        description: string
      }
      sns: {
        name: string
        description: string
      }
      sqs: {
        name: string
        description: string
      }
    }
  }

  // 액션 선택 섹션
  actions: {
    title: string
    subtitle: string
    selectedCount: string // "{count}개 선택됨"
    selectResource: string
    arnLabel: string // "ARN (선택사항)"
    arnPlaceholder: {
      s3: string
      ec2: string
      lambda: string
      dynamodb: string
      cloudwatch: string
      sns: string
      sqs: string
      default: string
    }
    arnHelp: {
      s3: string
      ec2: string
      lambda: string
      dynamodb: string
      cloudwatch: string
      sns: string
      sqs: string
      default: string
    }
    categories: {
      read: string
      write: string
      admin: string
    }
    actionsSelected: string // "{selected}/{total} 작업 선택됨"
  }

  // 정책 미리보기 섹션
  policy: {
    title: string
    valid: string
    selectActions: string
    noActionsSelected: string
    copyTooltip: string
    summary: {
      totalActions: string // "총 {count}개의 작업이 선택되었습니다"
      awsActions: string // "실제 AWS 액션 {count}개가 포함되었습니다"
      statements: string // "Statement {count}개가 생성되었습니다"
      resources: {
        label: string
        allResources: string
        specificArn: string
        mixed: string
        none: string
      }
    }
  }

  // AWS 서비스별 액션 설명
  awsActions: {
    s3: {
      listObjects: {
        name: string
        description: string
      }
      readObjects: {
        name: string
        description: string
      }
      writeObjects: {
        name: string
        description: string
      }
      deleteObjects: {
        name: string
        description: string
      }
      manageBuckets: {
        name: string
        description: string
      }
    }
    ec2: {
      viewInstances: {
        name: string
        description: string
      }
      controlInstances: {
        name: string
        description: string
      }
      manageInstances: {
        name: string
        description: string
      }
    }
    lambda: {
      viewFunctions: {
        name: string
        description: string
      }
      invokeFunctions: {
        name: string
        description: string
      }
      manageFunctions: {
        name: string
        description: string
      }
    }
    dynamodb: {
      readData: {
        name: string
        description: string
      }
      writeData: {
        name: string
        description: string
      }
      deleteData: {
        name: string
        description: string
      }
      manageTables: {
        name: string
        description: string
      }
    }
    sns: {
      publishMessages: {
        name: string
        description: string
      }
      manageSubscriptions: {
        name: string
        description: string
      }
      manageTopics: {
        name: string
        description: string
      }
    }
    cloudwatch: {
      viewMetrics: {
        name: string
        description: string
      }
      manageAlarms: {
        name: string
        description: string
      }
      manageLogs: {
        name: string
        description: string
      }
    }
    sqs: {
      receiveMessages: {
        name: string
        description: string
      }
      sendMessages: {
        name: string
        description: string
      }
      manageQueues: {
        name: string
        description: string
      }
    }
  }
}

// 번역 함수 타입
export type TranslationFunction = (key: string, params?: Record<string, string | number>) => string