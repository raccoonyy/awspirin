# AWS Policy Generator 웹 컴포넌트

AWS IAM 정책을 시각적으로 생성할 수 있는 경량 웹 컴포넌트입니다. 어떤 프레임워크에서도 사용할 수 있습니다.

## 🚀 주요 특징

- 🎯 **시각적 정책 빌더**: 직관적인 UI로 AWS 리소스와 권한 선택
- 🔧 **프레임워크 독립적**: 바닐라 HTML, React, Vue, Angular 등 어디서나 사용 가능
- 🎨 **완전 커스터마이징**: CSS 변수를 통한 테마 변경 지원
- 📱 **반응형 디자인**: 모바일 친화적 레이아웃
- 🌐 **ARN 목록 지원**: 미리 정의된 ARN 목록 제공 또는 직접 입력
- 📋 **클립보드 복사**: 원클릭 정책 복사
- 🔒 **읽기 전용 모드**: 기존 정책 표시용
- ⚡ **경량**: 최소한의 번들 크기 (57KB, gzipped 13.5KB)

## 📦 설치

```bash
npm install @awspirin/policy-generator
```

## 🎯 빠른 시작

### HTML에서 사용

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

### React에서 사용

```jsx
import '@awspirin/policy-generator'

function App() {
  return (
    <div>
      <aws-policy-generator 
        arn-list={JSON.stringify(['arn:aws:s3:::my-bucket', 'arn:aws:s3:::my-bucket/*'])}
        onResourceChange={(e) => console.log(e.detail)}
      />
    </div>
  )
}
```

### Vue에서 사용

```vue
<template>
  <aws-policy-generator 
    :arn-list="arnListJson"
    @resource-change="handleResourceChange"
  />
</template>

<script>
import '@awspirin/policy-generator'

export default {
  data() {
    return {
      arnList: ['arn:aws:s3:::my-bucket', 'arn:aws:s3:::my-bucket/*']
    }
  },
  computed: {
    arnListJson() {
      return JSON.stringify(this.arnList)
    }
  },
  methods: {
    handleResourceChange(event) {
      console.log(event.detail)
    }
  }
}
</script>
```

## ⚙️ 설정 옵션

### 속성 (Attributes)

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark'` | `'light'` | 테마 설정 |
| `language` | `'ko' \| 'en'` | `'en'` | 인터페이스 언어 |
| `readonly` | `boolean` | `false` | 읽기 전용 모드 |
| `arn-list` | `string[]` | `[]` | 미리 정의된 ARN 목록 |

### 이벤트 (Events)

| 이벤트 | 상세 정보 | 설명 |
|--------|-----------|------|
| `resource-change` | `{ resourceId: string, selected: boolean }` | 리소스 선택 변경 |
| `action-change` | `{ resourceId: string, actionId: string, selected: boolean }` | 액션 선택 변경 |
| `arn-change` | `{ resourceId: string, arn: string }` | ARN 입력 변경 |
| `policy-copied` | `{ policy: string }` | 정책 클립보드 복사 |

## 🎨 커스터마이징

### CSS 변수

```css
aws-policy-generator {
  --aws-primary-color: #232f3e;
  --aws-secondary-color: #ff9900;
  --aws-background-color: #ffffff;
  --aws-border-color: #e5e7eb;
  --aws-text-color: #374151;
  --aws-border-radius: 8px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### 다크 테마 예제

```css
aws-policy-generator[theme="dark"] {
  --aws-background-color: #1f2937;
  --aws-text-color: #f9fafb;
  --aws-border-color: #374151;
}
```

## 🔧 고급 사용법

### ARN 목록과 함께 사용

```html
<aws-policy-generator 
  arn-list='[
    "arn:aws:s3:::my-bucket", 
    "arn:aws:s3:::my-bucket/*", 
    "arn:aws:lambda:us-east-1:123456789012:function:my-function"
  ]'>
</aws-policy-generator>
```

### 이벤트 처리

```javascript
const generator = document.querySelector('aws-policy-generator');

generator.addEventListener('resource-change', (e) => {
  console.log('리소스 변경:', e.detail);
});

generator.addEventListener('policy-copied', (e) => {
  console.log('정책 복사됨:', e.detail.policy);
  // 사용자에게 알림 표시
  alert('정책이 클립보드에 복사되었습니다!');
});
```

### 프로그래밍 방식 접근

```javascript
import { generateIAMPolicy, isValidArn } from '@awspirin/policy-generator';

// 정책 직접 생성
const policy = generateIAMPolicy(resources, actions, actionMap);

// ARN 유효성 검사
const isValid = isValidArn('arn:aws:s3:::my-bucket');
```

## 🌐 브라우저 지원

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## 📝 라이선스

MIT License - 자세한 내용은 LICENSE 파일을 참조하세요.

## 🤝 기여하기

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📞 지원

- 📖 [문서](https://github.com/awspirin/policy-generator/wiki)
- 🐛 [이슈 트래커](https://github.com/awspirin/policy-generator/issues)
- 💬 [토론](https://github.com/awspirin/policy-generator/discussions)

## 🔍 개발 및 테스트

```bash
# 개발 서버 시작
npm run dev

# 라이브러리 빌드
npm run build

# 테스트 실행
npm test

# 린트 검사
npm run lint
```

자세한 개발 가이드는 [DEVELOPMENT.md](../DEVELOPMENT.md)를 참조하세요.