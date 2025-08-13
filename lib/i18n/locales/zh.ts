import type { Translations } from '../types'

export const zh: Translations = {
  common: {
    select: '选择',
    selected: '已选择',
    copy: '复制',
    copied: '已复制',
    optional: '可选',
    all: '全部',
    none: '无',
    search: '搜索',
    clear: '清除',
    apply: '应用',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息'
  },

  header: {
    title: 'AWSpirin',
    subtitle: '自动包含依赖关系的IAM策略生成器',
    githubIssue: '如需报告错误或提出功能建议，请使用[GitHub Issues](https://github.com/raccoonyy/awspirin/issues/new)'
  },

  hero: {
    mainTitle: '点击即可轻松',
    subTitle: '（无头痛）生成AWS IAM策略。'
  },

  footer: {
    githubIssue: '如需报告错误或提出功能建议，请使用[GitHub Issues](https://github.com/raccoonyy/awspirin/issues/new)'
  },

  resources: {
    title: '选择 AWS 资源',
    subtitle: '选择要应用策略的 AWS 服务。',
    selectedCount: '已选择 {count} 个',
    services: {
      s3: {
        name: 'S3 (简单存储服务)',
        description: '对象存储服务'
      },
      ec2: {
        name: 'EC2 (弹性计算云)',
        description: '虚拟服务器实例'
      },
      lambda: {
        name: 'Lambda',
        description: '无服务器计算服务'
      },
      dynamodb: {
        name: 'DynamoDB',
        description: 'NoSQL 数据库服务'
      },
      cloudwatch: {
        name: 'CloudWatch',
        description: '监控和日志服务'
      },
      sns: {
        name: 'SNS (简单通知服务)',
        description: '消息通知服务'
      },
      sqs: {
        name: 'SQS (简单队列服务)',
        description: '消息队列服务'
      }
    }
  },

  actions: {
    title: '选择操作',
    subtitle: '为选定的资源选择所需的权限。',
    selectedCount: '已选择 {count} 个',
    selectResource: '请先选择资源。',
    arnLabel: 'ARN（可选）',
    arnPlaceholder: {
      s3: '输入 S3 存储桶 ARN 将对存储桶和对象（/*）都应用权限',
      dynamodb: '输入 DynamoDB 表 ARN 将对表和索引（/*）都应用权限',
      cloudwatch: '输入 CloudWatch 日志组 ARN 将对日志组和流（:*）都应用权限',
      default: '留空将应用于所有资源（*）'
    },
    arnHelp: {
      s3: 'arn:aws:s3:::my-bucket',
      dynamodb: 'arn:aws:dynamodb:region:account:table/table-name',
      cloudwatch: 'arn:aws:logs:region:account:log-group:log-group-name',
      default: 'arn:aws:{service}:region:account:resource'
    },
    categories: {
      read: '读取权限',
      write: '写入权限',
      admin: '管理权限'
    },
    actionsSelected: '已选择 {selected}/{total} 个操作'
  },

  policy: {
    title: '生成的策略',
    valid: '有效策略',
    selectActions: '请选择操作。',
    noActionsSelected: '选择操作后将生成策略',
    copyTooltip: '复制到剪贴板',
    summary: {
      totalActions: '总共选择了 {count} 个操作',
      awsActions: '包含 {count} 个 AWS 操作',
      statements: '生成了 {count} 个语句',
      resources: {
        label: '资源',
        allResources: '所有资源（*）',
        specificArn: '特定 ARN',
        mixed: '所有资源（*）+ 特定 ARN',
        none: '无'
      }
    }
  },

  awsActions: {
    s3: {
      listObjects: {
        name: '列出对象',
        description: '列出 S3 存储桶中的对象'
      },
      readObjects: {
        name: '读取对象',
        description: '从 S3 存储桶读取对象'
      },
      writeObjects: {
        name: '上传/修改对象',
        description: '在 S3 存储桶中上传和修改对象'
      },
      deleteObjects: {
        name: '删除对象',
        description: '从 S3 存储桶删除对象'
      },
      manageBuckets: {
        name: '管理存储桶',
        description: '创建、删除和配置 S3 存储桶'
      }
    },
    ec2: {
      viewInstances: {
        name: '查看实例',
        description: '查看 EC2 实例信息'
      },
      controlInstances: {
        name: '控制实例',
        description: '启动、停止和重启 EC2 实例'
      },
      manageInstances: {
        name: '管理实例',
        description: '创建和终止 EC2 实例'
      }
    },
    lambda: {
      viewFunctions: {
        name: '查看函数',
        description: '列出和查看 Lambda 函数信息'
      },
      invokeFunctions: {
        name: '调用函数',
        description: '执行 Lambda 函数'
      },
      manageFunctions: {
        name: '管理函数',
        description: '创建、修改和删除 Lambda 函数'
      }
    },
    dynamodb: {
      readData: {
        name: '读取数据',
        description: '从 DynamoDB 表读取和查询数据'
      },
      writeData: {
        name: '写入数据',
        description: '在 DynamoDB 表中创建和修改数据'
      },
      deleteData: {
        name: '删除数据',
        description: '从 DynamoDB 表删除数据'
      },
      manageTables: {
        name: '管理表',
        description: '创建、修改和删除 DynamoDB 表'
      }
    },
    sns: {
      publishMessages: {
        name: '发布消息',
        description: '向 SNS 主题发布消息'
      },
      manageSubscriptions: {
        name: '管理订阅',
        description: '管理 SNS 主题订阅'
      },
      manageTopics: {
        name: '管理主题',
        description: '创建、修改和删除 SNS 主题'
      }
    },
    cloudwatch: {
      viewMetrics: {
        name: '查看指标',
        description: '查看 CloudWatch 指标'
      },
      manageAlarms: {
        name: '管理警报',
        description: '创建、修改和删除 CloudWatch 警报'
      },
      manageLogs: {
        name: '管理日志',
        description: '管理 CloudWatch 日志'
      }
    },
    sqs: {
      receiveMessages: {
        name: '接收消息',
        description: '从 SQS 队列接收和删除消息'
      },
      sendMessages: {
        name: '发送消息',
        description: '向 SQS 队列发送消息'
      },
      manageQueues: {
        name: '管理队列',
        description: '创建、修改和删除 SQS 队列'
      }
    }
  }
}