import type { Translations } from '../types'

export const ko: Translations = {
  common: {
    select: '선택',
    selected: '선택됨',
    copy: '복사',
    copied: '복사됨',
    optional: '선택사항',
    all: '전체',
    none: '없음',
    search: '검색',
    clear: '지우기',
    apply: '적용',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    close: '닫기',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    warning: '경고',
    info: '정보'
  },

  header: {
    title: 'AWS IAM Policy Generator',
    subtitle: '의존성까지 자동으로 입력해주는 IAM 정책 생성기',
    githubIssue: '버그 신고나 기능 제안은 [깃헙 이슈](https://github.com/raccoonyy/awspirin/issues/new)를 사용해주세요'
  },

  footer: {
    githubIssue: '버그 신고나 기능 제안은 [깃헙 이슈](https://github.com/raccoonyy/awspirin/issues/new)를 사용해주세요'
  },

  resources: {
    title: 'AWS 리소스 선택',
    subtitle: '정책을 적용할 AWS 서비스를 선택하세요.',
    selectedCount: '{count}개 선택됨',
    services: {
      s3: {
        name: 'S3 (Simple Storage Service)',
        description: '객체 스토리지 서비스'
      },
      ec2: {
        name: 'EC2 (Elastic Compute Cloud)',
        description: '가상 서버 인스턴스'
      },
      lambda: {
        name: 'Lambda',
        description: '서버리스 컴퓨팅 서비스'
      },
      dynamodb: {
        name: 'DynamoDB',
        description: 'NoSQL 데이터베이스 서비스'
      },
      cloudwatch: {
        name: 'CloudWatch',
        description: '모니터링 및 로깅 서비스'
      },
      sns: {
        name: 'SNS (Simple Notification Service)',
        description: '메시지 알림 서비스'
      },
      sqs: {
        name: 'SQS (Simple Queue Service)',
        description: '메시지 큐 서비스'
      }
    }
  },

  actions: {
    title: '작업 선택',
    subtitle: '선택한 리소스에 대해 필요한 권한을 선택하세요.',
    selectedCount: '{count}개 선택됨',
    selectResource: '리소스를 먼저 선택하세요.',
    arnLabel: 'ARN (선택사항)',
    arnPlaceholder: {
      s3: 'S3 버킷 ARN을 입력하면 버킷과 객체(/*) 모두에 대한 권한이 적용됩니다',
      dynamodb: 'DynamoDB 테이블 ARN을 입력하면 테이블과 인덱스(/*) 모두에 대한 권한이 적용됩니다',
      cloudwatch: 'CloudWatch 로그 그룹 ARN을 입력하면 로그 그룹과 스트림(:*) 모두에 대한 권한이 적용됩니다',
      default: '비워두면 모든 리소스(*)에 적용됩니다'
    },
    arnHelp: {
      s3: 'arn:aws:s3:::my-bucket',
      dynamodb: 'arn:aws:dynamodb:region:account:table/table-name',
      cloudwatch: 'arn:aws:logs:region:account:log-group:log-group-name',
      default: 'arn:aws:{service}:region:account:resource'
    },
    categories: {
      read: '읽기 권한',
      write: '쓰기 권한',
      admin: '관리 권한'
    },
    actionsSelected: '{selected}/{total} 작업 선택됨'
  },

  policy: {
    title: '생성된 정책',
    valid: '유효한 정책',
    selectActions: '액션을 선택해주세요.',
    noActionsSelected: '작업을 선택하면 정책이 생성됩니다',
    copyTooltip: '클립보드에 복사하기',
    summary: {
      totalActions: '총 {count}개의 작업이 선택되었습니다',
      awsActions: '실제 AWS 액션 {count}개가 포함되었습니다',
      statements: 'Statement {count}개가 생성되었습니다',
      resources: {
        label: '리소스',
        allResources: '모든 리소스(*)',
        specificArn: '특정 ARN',
        mixed: '모든 리소스(*) + 특정 ARN',
        none: '없음'
      }
    }
  },

  awsActions: {
    s3: {
      listObjects: {
        name: '객체 목록 조회',
        description: 'S3 버킷의 객체 목록을 조회합니다'
      },
      readObjects: {
        name: '객체 읽기',
        description: 'S3 버킷에서 객체를 읽습니다'
      },
      writeObjects: {
        name: '객체 업로드/수정',
        description: 'S3 버킷에 객체를 업로드하고 수정합니다'
      },
      deleteObjects: {
        name: '객체 삭제',
        description: 'S3 버킷에서 객체를 삭제합니다'
      },
      manageBuckets: {
        name: '버킷 관리',
        description: 'S3 버킷을 생성, 삭제, 설정합니다'
      }
    },
    ec2: {
      viewInstances: {
        name: '인스턴스 조회',
        description: 'EC2 인스턴스 정보를 조회합니다'
      },
      controlInstances: {
        name: '인스턴스 제어',
        description: 'EC2 인스턴스를 시작, 중지, 재시작합니다'
      },
      manageInstances: {
        name: '인스턴스 관리',
        description: 'EC2 인스턴스를 생성, 종료합니다'
      }
    },
    lambda: {
      viewFunctions: {
        name: '함수 조회',
        description: 'Lambda 함수 목록과 정보를 조회합니다'
      },
      invokeFunctions: {
        name: '함수 실행',
        description: 'Lambda 함수를 실행합니다'
      },
      manageFunctions: {
        name: '함수 관리',
        description: 'Lambda 함수를 생성, 수정, 삭제합니다'
      }
    },
    dynamodb: {
      readData: {
        name: '데이터 읽기',
        description: 'DynamoDB 테이블에서 데이터를 읽고 쿼리합니다'
      },
      writeData: {
        name: '데이터 쓰기',
        description: 'DynamoDB 테이블에 데이터를 생성, 수정합니다'
      },
      deleteData: {
        name: '데이터 삭제',
        description: 'DynamoDB 테이블에서 데이터를 삭제합니다'
      },
      manageTables: {
        name: '테이블 관리',
        description: 'DynamoDB 테이블을 생성, 수정, 삭제합니다'
      }
    },
    sns: {
      publishMessages: {
        name: '메시지 발행',
        description: 'SNS 토픽에 메시지를 발행합니다'
      },
      manageSubscriptions: {
        name: '구독 관리',
        description: 'SNS 토픽의 구독을 관리합니다'
      },
      manageTopics: {
        name: '토픽 관리',
        description: 'SNS 토픽을 생성, 수정, 삭제합니다'
      }
    },
    cloudwatch: {
      viewMetrics: {
        name: '메트릭 조회',
        description: 'CloudWatch 메트릭을 조회합니다'
      },
      manageAlarms: {
        name: '알람 관리',
        description: 'CloudWatch 알람을 생성, 수정, 삭제합니다'
      },
      manageLogs: {
        name: '로그 관리',
        description: 'CloudWatch 로그를 관리합니다'
      }
    },
    sqs: {
      receiveMessages: {
        name: '메시지 수신',
        description: 'SQS 큐에서 메시지를 수신하고 삭제합니다'
      },
      sendMessages: {
        name: '메시지 전송',
        description: 'SQS 큐에 메시지를 전송합니다'
      },
      manageQueues: {
        name: '큐 관리',
        description: 'SQS 큐를 생성, 수정, 삭제합니다'
      }
    }
  }
}