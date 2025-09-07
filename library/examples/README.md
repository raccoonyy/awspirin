# AWS IAM Policy Generator - Examples

이 폴더는 AWS IAM Policy Generator 라이브러리의 예제들을 포함하고 있습니다.

## 🚀 라이브 데모

[https://raccoonyy.github.io/awspirin-lib](https://raccoonyy.github.io/awspirin-lib)에서 모든 예제를 확인할 수 있습니다.

## 📱 예제 목록

### 1. Basic Example
- **파일**: `basic-example.html`
- **설명**: ARN 드롭다운과 자동 의존성 해결 기능을 포함한 기본 예제
- **특징**:
  - ARN 드롭다운 선택
  - 자동 의존성 해결
  - 반응형 레이아웃
  - 라이트/다크 테마

### 2. Headless Mode
- **파일**: `headless-demo.html`  
- **설명**: UI 없이 핵심 로직만 사용하는 예제
- **특징**:
  - 프레임워크 독립적
  - 서버사이드 호환
  - CLI 도구 지원
  - API 통합

### 3. Multi-language Support
- **파일**: `i18n-demo.html`
- **설명**: 다국어 지원 기능을 보여주는 예제
- **특징**:
  - 영어 (English)
  - 한국어
  - 일본어 (日本語)
  - 중국어 (中文)

## 🛠️ 로컬 실행

```bash
# 라이브러리 빌드
npm run build

# 로컬 서버 실행 (예: Python)
cd examples
python -m http.server 8000

# 또는 Node.js
npx http-server
```

그 후 http://localhost:8000에서 예제들을 확인할 수 있습니다.

## ✨ 주요 기능

- **ARN 드롭다운**: 서비스별 ARN 자동 필터링
- **의존성 해결**: 액션 선택 시 자동으로 필수 권한 포함
- **반응형 레이아웃**: 화면 크기에 따라 자동 조정
- **다국어 지원**: 4개 언어 지원
- **헤드리스 모드**: UI 없이 핵심 기능만 사용 가능

## 📋 의존성 해결 예시

`s3:GetObject` 선택 시 자동으로 다음 권한들이 포함됩니다:
- `s3:GetObject`
- `s3:ListBucket`  
- `s3:GetBucketLocation`

## 🔗 관련 링크

- [라이브러리 소스코드](../)
- [NPM 패키지](https://www.npmjs.com/package/@awspirin/awspirin-lib)
- [GitHub 저장소](https://github.com/raccoonyy/awspirin-lib)