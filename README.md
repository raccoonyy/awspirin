# AWS IAM Policy Generator 라이브러리

AWS IAM 정책을 시각적으로 생성할 수 있는 웹 컴포넌트 라이브러리입니다. 어떤 웹사이트나 프레임워크에서도 쉽게 사용할 수 있습니다.

🔗 **[라이브 데모 보기](https://awspirin.cloud)** | 📦 **[라이브러리 문서](https://awspirin.cloud/library)** | 🎮 **[플레이그라운드](https://awspirin.cloud/playground)**

## ✨ 핵심 기능: 자동 의존성 해결

AWS IAM 정책 작성 시 가장 어려운 점 중 하나는 필요한 모든 권한을 빠짐없이 포함시키는 것입니다. awspirin은 **자동으로 액션 의존성을 해결**하여 이 문제를 해결합니다.

예를 들어, S3 객체를 읽으려면:
- ❌ 수동 작성: `s3:GetObject`만 추가하면 실패할 수 있음
- ✅ awspirin: `s3:GetObject`, `s3:ListBucket`, `s3:GetBucketLocation`을 자동으로 포함

## 🚀 빠른 시작

### 1. 설치

```bash
npm install @awspirin/policy-generator
```

### 2. 기본 사용법

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="https://unpkg.com/@awspirin/policy-generator"></script>
</head>
<body>
    <aws-policy-generator></aws-policy-generator>
</body>
</html>
```

## 📖 상세 튜토리얼

### 기본 설정

가장 간단한 형태로 AWS Policy Generator를 사용하는 방법입니다.

```html
<aws-policy-generator></aws-policy-generator>
```

이렇게 하면 기본 설정으로 정책 생성기가 표시됩니다:
- AWS 서비스 선택 패널 (S3, EC2, Lambda 등)
- 권한 설정 패널 (읽기/쓰기/관리자 권한)
- 정책 미리보기 패널 (JSON 형태)

### ARN 목록 미리 설정하기

사용자가 선택할 수 있는 ARN 목록을 미리 제공할 수 있습니다.

```html
<aws-policy-generator 
  arn-list='[
    "arn:aws:s3:::my-production-bucket",
    "arn:aws:s3:::my-production-bucket/*",
    "arn:aws:lambda:us-east-1:123456789012:function:my-function",
    "arn:aws:dynamodb:us-east-1:123456789012:table/my-table"
  ]'>
</aws-policy-generator>
```

**장점:**
- 사용자가 ARN을 직접 입력할 필요 없음
- 오타 방지
- 조직의 표준 리소스만 선택하도록 제한 가능

### 테마 커스터마이징

CSS 변수를 사용해서 디자인을 자유롭게 변경할 수 있습니다.

```html
<aws-policy-generator 
  style="
    --aws-primary-color: #0066cc;
    --aws-secondary-color: #ff6600;
    --aws-background-color: #ffffff;
    --aws-border-color: #dddddd;
    --aws-text-color: #333333;
    --aws-border-radius: 12px;
    --font-family: 'Pretendard', sans-serif;
  ">
</aws-policy-generator>
```

#### 다크 테마 예제

```html
<aws-policy-generator 
  theme="dark"
  style="
    --aws-background-color: #1f2937;
    --aws-text-color: #f9fafb;
    --aws-border-color: #374151;
    --aws-primary-color: #3b82f6;
    --aws-secondary-color: #f59e0b;
  ">
</aws-policy-generator>
```

### 읽기 전용 모드

기존 정책을 표시만 하고 수정은 불가능하게 하려면:

```html
<aws-policy-generator readonly></aws-policy-generator>
```

**사용 사례:**
- 현재 적용된 정책 확인
- 정책 검토 및 승인 과정
- 교육 목적의 정책 예시

## 🔧 프레임워크별 사용법

### React에서 사용하기

```jsx
import '@awspirin/policy-generator'
import { useRef, useEffect } from 'react'

function PolicyGenerator() {
  const generatorRef = useRef(null)

  useEffect(() => {
    const generator = generatorRef.current
    
    const handleResourceChange = (e) => {
      console.log('리소스 변경:', e.detail)
    }
    
    const handlePolicyCopied = (e) => {
      alert('정책이 클립보드에 복사되었습니다!')
    }

    generator?.addEventListener('resource-change', handleResourceChange)
    generator?.addEventListener('policy-copied', handlePolicyCopied)

    return () => {
      generator?.removeEventListener('resource-change', handleResourceChange)
      generator?.removeEventListener('policy-copied', handlePolicyCopied)
    }
  }, [])

  return (
    <div>
      <h1>AWS 정책 생성기</h1>
      <aws-policy-generator 
        ref={generatorRef}
        arn-list={JSON.stringify([
          'arn:aws:s3:::my-bucket',
          'arn:aws:lambda:us-east-1:123456789012:function:my-function'
        ])}
      />
    </div>
  )
}
```

### Vue.js에서 사용하기

```vue
<template>
  <div>
    <h1>AWS 정책 생성기</h1>
    <aws-policy-generator 
      :arn-list="arnList"
      @resource-change="handleResourceChange"
      @policy-copied="handlePolicyCopied"
    />
  </div>
</template>

<script>
import '@awspirin/policy-generator'

export default {
  name: 'PolicyGenerator',
  data() {
    return {
      arnList: [
        'arn:aws:s3:::my-bucket',
        'arn:aws:lambda:us-east-1:123456789012:function:my-function'
      ]
    }
  },
  methods: {
    handleResourceChange(event) {
      console.log('리소스 변경:', event.detail)
    },
    handlePolicyCopied(event) {
      this.$message.success('정책이 클립보드에 복사되었습니다!')
    }
  }
}
</script>
```

### Angular에서 사용하기

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import '@awspirin/policy-generator'

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ... 기타 설정
})
export class AppModule { }
```

```typescript
// component.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core'

@Component({
  selector: 'app-policy-generator',
  template: `
    <h1>AWS 정책 생성기</h1>
    <aws-policy-generator 
      #generator
      [attr.arn-list]="arnListJson">
    </aws-policy-generator>
  `
})
export class PolicyGeneratorComponent implements AfterViewInit {
  @ViewChild('generator') generator!: ElementRef

  arnList = [
    'arn:aws:s3:::my-bucket',
    'arn:aws:lambda:us-east-1:123456789012:function:my-function'
  ]

  get arnListJson() {
    return JSON.stringify(this.arnList)
  }

  ngAfterViewInit() {
    this.generator.nativeElement.addEventListener('resource-change', (e: any) => {
      console.log('리소스 변경:', e.detail)
    })

    this.generator.nativeElement.addEventListener('policy-copied', (e: any) => {
      alert('정책이 클립보드에 복사되었습니다!')
    })
  }
}
```

## 📡 이벤트 처리

컴포넌트에서 발생하는 이벤트를 처리해서 외부 애플리케이션과 연동할 수 있습니다.

```javascript
const generator = document.querySelector('aws-policy-generator')

// 리소스 선택 변경 시
generator.addEventListener('resource-change', (e) => {
  console.log(`${e.detail.resourceId} 리소스가 ${e.detail.selected ? '선택' : '해제'}되었습니다`)
})

// 권한 액션 변경 시
generator.addEventListener('action-change', (e) => {
  console.log(`${e.detail.resourceId}의 ${e.detail.actionId} 액션이 ${e.detail.selected ? '선택' : '해제'}되었습니다`)
})

// ARN 입력 변경 시
generator.addEventListener('arn-change', (e) => {
  console.log(`${e.detail.resourceId}의 ARN이 변경되었습니다: ${e.detail.arn}`)
})

// 정책 복사 시
generator.addEventListener('policy-copied', (e) => {
  console.log('정책이 클립보드에 복사되었습니다')
  // 사용자에게 알림 표시
  showNotification('정책이 복사되었습니다!')
})
```

## 🎨 고급 커스터마이징

### 완전한 테마 변경

```css
aws-policy-generator {
  /* 색상 */
  --aws-primary-color: #2563eb;
  --aws-secondary-color: #dc2626;
  --aws-background-color: #ffffff;
  --aws-border-color: #e5e7eb;
  --aws-text-color: #111827;
  
  /* 레이아웃 */
  --aws-border-radius: 8px;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* 크기 조정 */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  aws-policy-generator {
    --aws-border-radius: 4px;
  }
}
```

### 특정 패널 숨기기

CSS를 사용해서 특정 패널을 숨길 수도 있습니다:

```css
/* 리소스 선택 패널만 표시 */
aws-policy-generator .panel:nth-child(2),
aws-policy-generator .panel:nth-child(3) {
  display: none;
}

aws-policy-generator .container {
  grid-template-columns: 1fr;
}
```

## 🔍 실제 사용 예제

### 1. 회사 내부 도구로 사용

```html
<!DOCTYPE html>
<html>
<head>
    <title>우리 회사 AWS 정책 생성기</title>
    <script type="module" src="https://unpkg.com/@awspirin/policy-generator"></script>
    <style>
        aws-policy-generator {
            --aws-primary-color: #1e40af;
            --aws-secondary-color: #059669;
            --font-family: 'Noto Sans KR', sans-serif;
        }
    </style>
</head>
<body>
    <header>
        <h1>AWS IAM 정책 생성기</h1>
        <p>우리 회사의 표준 AWS 리소스에 대한 정책을 생성하세요.</p>
    </header>
    
    <aws-policy-generator 
        arn-list='[
            "arn:aws:s3:::company-production-bucket",
            "arn:aws:s3:::company-staging-bucket",
            "arn:aws:lambda:us-east-1:123456789012:function:api-gateway",
            "arn:aws:dynamodb:us-east-1:123456789012:table/users",
            "arn:aws:dynamodb:us-east-1:123456789012:table/products"
        ]'>
    </aws-policy-generator>

    <script>
        // 정책이 생성되면 자동으로 Slack에 알림
        document.querySelector('aws-policy-generator')
            .addEventListener('policy-copied', async (e) => {
                await fetch('/api/notify-slack', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: '새로운 IAM 정책이 생성되었습니다.',
                        policy: e.detail.policy
                    })
                })
            })
    </script>
</body>
</html>
```

### 2. 교육용 도구로 사용

```html
<div class="tutorial-step">
    <h2>단계 1: S3 버킷 읽기 권한 설정</h2>
    <p>S3 버킷의 객체를 읽을 수 있는 최소 권한을 설정해보세요.</p>
    
    <aws-policy-generator 
        arn-list='["arn:aws:s3:::tutorial-bucket", "arn:aws:s3:::tutorial-bucket/*"]'
        style="--aws-border-color: #3b82f6; border: 2px solid var(--aws-border-color);">
    </aws-policy-generator>
    
    <div class="hint">
        💡 힌트: S3 서비스를 선택하고 "Read Objects" 권한을 활성화하세요.
    </div>
</div>
```

## 🛠️ 프로그래밍 방식 사용

라이브러리의 유틸리티 함수들을 직접 사용할 수도 있습니다:

```javascript
import { 
  generateIAMPolicy, 
  isValidArn, 
  processServiceArn,
  defaultAWSResources,
  defaultAWSActions
} from '@awspirin/policy-generator'

// ARN 유효성 검사
const arn = 'arn:aws:s3:::my-bucket'
if (isValidArn(arn)) {
  console.log('유효한 ARN입니다')
}

// S3 ARN 처리 (버킷과 객체 ARN 자동 생성)
const processedArns = processServiceArn('s3', 'arn:aws:s3:::my-bucket')
console.log(processedArns) 
// ['arn:aws:s3:::my-bucket', 'arn:aws:s3:::my-bucket/*']

// 정책 직접 생성
const resources = defaultAWSResources.map(r => ({ ...r, selected: r.id === 's3' }))
const actions = { ...defaultAWSActions }
actions.s3 = actions.s3.map(a => ({ ...a, selected: a.id === 's3-read-objects' }))

const policy = generateIAMPolicy(resources.filter(r => r.selected), 
                                Object.values(actions).flat().filter(a => a.selected), 
                                actions)
console.log(JSON.stringify(policy, null, 2))
```

## 📱 모바일 최적화

컴포넌트는 자동으로 모바일에 최적화되지만, 추가 설정도 가능합니다:

```css
@media (max-width: 768px) {
  aws-policy-generator {
    /* 모바일에서는 세로 레이아웃 */
    --mobile-layout: column;
  }
}
```

## 🔒 보안 고려사항

1. **ARN 검증**: 입력된 ARN이 유효한 형식인지 자동으로 검증합니다.
2. **XSS 방지**: 모든 사용자 입력은 안전하게 처리됩니다.
3. **CSP 호환**: Content Security Policy와 호환됩니다.

## 🐛 문제 해결

### 컴포넌트가 표시되지 않는 경우

1. 스크립트가 올바르게 로드되었는지 확인:
```javascript
console.log(customElements.get('aws-policy-generator'))
// undefined가 아니어야 함
```

2. CSS 변수가 올바르게 설정되었는지 확인:
```css
aws-policy-generator {
  display: block; /* 명시적으로 설정 */
  min-height: 600px;
}
```

### ARN 목록이 표시되지 않는 경우

ARN 목록은 유효한 JSON 문자열이어야 합니다:
```html
<!-- 올바른 형식 -->
<aws-policy-generator arn-list='["arn:aws:s3:::bucket"]'></aws-policy-generator>

<!-- 잘못된 형식 -->
<aws-policy-generator arn-list="arn:aws:s3:::bucket"></aws-policy-generator>
```

## 📞 지원 및 문의

- 🐛 버그 리포트: [GitHub Issues](https://github.com/awspirin/policy-generator/issues)
- 💬 질문 및 토론: [GitHub Discussions](https://github.com/awspirin/policy-generator/discussions)
- 📖 상세 문서: [Wiki](https://github.com/awspirin/policy-generator/wiki)

## 📄 라이선스

MIT 라이선스 - 자유롭게 사용, 수정, 배포할 수 있습니다.