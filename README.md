# AWS IAM Policy Generator

시각적으로 AWS IAM 정책을 생성하고 관리할 수 있는 웹 애플리케이션입니다.

## 🚀 Live Demo

**Production:** [https://your-username.github.io/paws/](https://your-username.github.io/paws/)

## ✨ 주요 기능

- **직관적인 UI**: 드래그 앤 드롭 방식의 리소스 및 권한 선택
- **작업 중심 선택**: "객체 읽기", "인스턴스 제어" 등 직관적인 작업 단위로 권한 선택
- **자동 의존성 처리**: 선택한 작업에 필요한 의존성 권한 자동 포함
- **ARN별 정책 분리**: 리소스별 ARN 입력 시 별도 Statement 생성
- **실시간 미리보기**: JSON 형태의 완전한 IAM 정책 실시간 생성
- **다중 AWS 서비스 지원**: S3, EC2, Lambda, DynamoDB, CloudWatch, SNS, SQS

## 🛠️ 지원하는 AWS 서비스

### S3 (Simple Storage Service)
- 객체 목록 조회, 읽기, 업로드/수정, 삭제
- 버킷 관리 (생성, 삭제, 정책 설정)
- **특별 처리**: 버킷 ARN 입력 시 버킷과 객체(`/*`) 권한 모두 포함

### EC2 (Elastic Compute Cloud)
- 인스턴스 조회, 제어 (시작/중지/재시작)
- 인스턴스 관리 (생성/종료)

### Lambda
- 함수 조회, 실행
- 함수 관리 (생성/수정/삭제)

### DynamoDB
- 데이터 읽기, 쓰기, 삭제
- 테이블 관리 (생성/수정/삭제)
- **특별 처리**: 테이블 ARN 입력 시 테이블과 인덱스(`/*`) 권한 모두 포함

### CloudWatch
- 메트릭 조회, 알람 관리
- 로그 관리
- **특별 처리**: 로그 그룹 ARN 입력 시 로그 그룹과 스트림(`:*`) 권한 모두 포함

### SNS & SQS
- 메시지 발행/수신, 구독 관리
- 토픽/큐 관리

## 🏗️ 기술 스택

- **Frontend**: React 18+ with TypeScript
- **Framework**: Next.js 14 (Static Export)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages with GitHub Actions

## 🚀 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다:

### Production 배포
- `main` 브랜치에 푸시하면 자동으로 GitHub Pages에 배포
- URL: `https://your-username.github.io/paws/`

### PR 미리보기
- 새 PR 생성 시 자동으로 미리보기 환경 생성
- URL: `https://your-username.github.io/paws/preview/branch-name/`
- PR 코멘트에 미리보기 링크 자동 추가
- PR 종료 시 미리보기 환경 자동 정리

## 💻 로컬 개발

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (선택사항)
cp .env.local.example .env.local
# .env.local 파일에서 GTM_ID 설정

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 정적 파일 생성 (GitHub Pages용)
npm run build
```

## 📊 분석 설정

### Google Tag Manager 설정

1. **GTM 계정 생성**: [Google Tag Manager](https://tagmanager.google.com/)에서 계정 생성
2. **컨테이너 생성**: 웹사이트용 컨테이너 생성 후 GTM ID 확인 (GTM-XXXXXXX)
3. **GitHub Secrets 설정**:
   - Repository Settings → Secrets and variables → Actions
   - `GTM_ID` secret 추가 (예: GTM-XXXXXXX)
4. **로컬 개발**: `.env.local` 파일에 `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` 추가

### 추적되는 이벤트

- **resource_toggle**: AWS 리소스 선택/해제
- **action_toggle**: 권한 액션 선택/해제  
- **arn_input**: ARN 입력
- **policy_copy**: 정책 복사

### GTM에서 설정할 수 있는 태그 예시

- Google Analytics 4
- Facebook Pixel
- 기타 마케팅/분석 도구

## 📝 사용 방법

1. **리소스 선택**: 왼쪽 패널에서 필요한 AWS 서비스를 선택합니다
2. **ARN 입력** (선택사항): 각 리소스별로 특정 ARN을 입력할 수 있습니다
3. **권한 선택**: 가운데 패널에서 필요한 권한을 선택합니다
   - 읽기 권한 (초록색)
   - 쓰기 권한 (파란색)  
   - 관리 권한 (빨간색)
4. **정책 확인**: 오른쪽 패널에서 생성된 JSON 정책을 확인합니다
5. **복사**: 생성된 정책을 클립보드로 복사하여 AWS 콘솔에서 사용합니다

## 🔒 보안 고려사항

- 의존성 권한 자동 포함으로 누락된 권한으로 인한 오류 방지
- ARN별 Statement 분리로 최소 권한 원칙 준수
- 실제 AWS 액션 코드 표시로 투명성 제공

## 📄 라이선스

MIT License

## 🤝 기여

이슈 리포트와 풀 리퀘스트를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request