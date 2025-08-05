import type { Translations } from '../types'

export const ja: Translations = {
  common: {
    select: '選択',
    selected: '選択済み',
    copy: 'コピー',
    copied: 'コピー済み',
    optional: 'オプション',
    all: 'すべて',
    none: 'なし',
    search: '検索',
    clear: 'クリア',
    apply: '適用',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    warning: '警告',
    info: '情報'
  },

  header: {
    title: 'AWS IAM ポリシージェネレーター',
    subtitle: '依存関係まで自動で入力するIAMポリシー生成器'
  },

  resources: {
    title: 'AWS リソース選択',
    subtitle: 'ポリシーを適用するAWSサービスを選択してください。',
    selectedCount: '{count}個選択済み',
    services: {
      s3: {
        name: 'S3 (Simple Storage Service)',
        description: 'オブジェクトストレージサービス'
      },
      ec2: {
        name: 'EC2 (Elastic Compute Cloud)',
        description: '仮想サーバーインスタンス'
      },
      lambda: {
        name: 'Lambda',
        description: 'サーバーレスコンピューティングサービス'
      },
      dynamodb: {
        name: 'DynamoDB',
        description: 'NoSQLデータベースサービス'
      },
      cloudwatch: {
        name: 'CloudWatch',
        description: 'モニタリング・ログサービス'
      },
      sns: {
        name: 'SNS (Simple Notification Service)',
        description: 'メッセージ通知サービス'
      },
      sqs: {
        name: 'SQS (Simple Queue Service)',
        description: 'メッセージキューサービス'
      }
    }
  },

  actions: {
    title: 'アクション選択',
    subtitle: '選択したリソースに必要な権限を選択してください。',
    selectedCount: '{count}個選択済み',
    selectResource: 'まずリソースを選択してください。',
    arnLabel: 'ARN（オプション）',
    arnPlaceholder: {
      s3: 'arn:aws:s3:::my-bucket',
      dynamodb: 'arn:aws:dynamodb:region:account:table/table-name',
      cloudwatch: 'arn:aws:logs:region:account:log-group:log-group-name',
      default: 'arn:aws:{service}:region:account:resource'
    },
    arnHelp: {
      s3: 'S3バケットARNを入力すると、バケットとオブジェクト（/*）の両方に権限が適用されます',
      dynamodb: 'DynamoDBテーブルARNを入力すると、テーブルとインデックス（/*）の両方に権限が適用されます',
      cloudwatch: 'CloudWatchロググループARNを入力すると、ロググループとストリーム（:*）の両方に権限が適用されます',
      default: '空白にするとすべてのリソース（*）に適用されます'
    },
    categories: {
      read: '読み取り権限',
      write: '書き込み権限',
      admin: '管理者権限'
    },
    actionsSelected: '{selected}/{total} アクション選択済み'
  },

  policy: {
    title: '生成されたポリシー',
    valid: '有効なポリシー',
    selectActions: 'アクションを選択してください。',
    noActionsSelected: 'アクションを選択するとポリシーが生成されます',
    summary: {
      totalActions: '合計{count}個のアクションが選択されました',
      awsActions: '{count}個のAWSアクションが含まれています',
      statements: '{count}個のStatementが生成されました',
      resources: {
        label: 'リソース',
        allResources: 'すべてのリソース（*）',
        specificArn: '特定のARN',
        mixed: 'すべてのリソース（*）+ 特定のARN',
        none: 'なし'
      }
    }
  },

  awsActions: {
    s3: {
      listObjects: {
        name: 'オブジェクト一覧取得',
        description: 'S3バケット内のオブジェクト一覧を取得します'
      },
      readObjects: {
        name: 'オブジェクト読み取り',
        description: 'S3バケットからオブジェクトを読み取ります'
      },
      writeObjects: {
        name: 'オブジェクトアップロード/変更',
        description: 'S3バケットにオブジェクトをアップロード・変更します'
      },
      deleteObjects: {
        name: 'オブジェクト削除',
        description: 'S3バケットからオブジェクトを削除します'
      },
      manageBuckets: {
        name: 'バケット管理',
        description: 'S3バケットの作成、削除、設定を行います'
      }
    },
    ec2: {
      viewInstances: {
        name: 'インスタンス表示',
        description: 'EC2インスタンス情報を表示します'
      },
      controlInstances: {
        name: 'インスタンス制御',
        description: 'EC2インスタンスの開始、停止、再起動を行います'
      },
      manageInstances: {
        name: 'インスタンス管理',
        description: 'EC2インスタンスの作成、終了を行います'
      }
    },
    lambda: {
      viewFunctions: {
        name: '関数表示',
        description: 'Lambda関数の一覧と情報を表示します'
      },
      invokeFunctions: {
        name: '関数実行',
        description: 'Lambda関数を実行します'
      },
      manageFunctions: {
        name: '関数管理',
        description: 'Lambda関数の作成、変更、削除を行います'
      }
    },
    dynamodb: {
      readData: {
        name: 'データ読み取り',
        description: 'DynamoDBテーブルからデータを読み取り・クエリします'
      },
      writeData: {
        name: 'データ書き込み',
        description: 'DynamoDBテーブルにデータを作成・変更します'
      },
      deleteData: {
        name: 'データ削除',
        description: 'DynamoDBテーブルからデータを削除します'
      },
      manageTables: {
        name: 'テーブル管理',
        description: 'DynamoDBテーブルの作成、変更、削除を行います'
      }
    },
    sns: {
      publishMessages: {
        name: 'メッセージ発行',
        description: 'SNSトピックにメッセージを発行します'
      },
      manageSubscriptions: {
        name: 'サブスクリプション管理',
        description: 'SNSトピックのサブスクリプションを管理します'
      },
      manageTopics: {
        name: 'トピック管理',
        description: 'SNSトピックの作成、変更、削除を行います'
      }
    },
    cloudwatch: {
      viewMetrics: {
        name: 'メトリクス表示',
        description: 'CloudWatchメトリクスを表示します'
      },
      manageAlarms: {
        name: 'アラーム管理',
        description: 'CloudWatchアラームの作成、変更、削除を行います'
      },
      manageLogs: {
        name: 'ログ管理',
        description: 'CloudWatchログを管理します'
      }
    },
    sqs: {
      receiveMessages: {
        name: 'メッセージ受信',
        description: 'SQSキューからメッセージを受信・削除します'
      },
      sendMessages: {
        name: 'メッセージ送信',
        description: 'SQSキューにメッセージを送信します'
      },
      manageQueues: {
        name: 'キュー管理',
        description: 'SQSキューの作成、変更、削除を行います'
      }
    }
  }
}