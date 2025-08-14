# AWSpirin for aspirin AWS IAM Policy Generating

AWS IAM 정책을 (두통 없이) 편리하게 생성할 수 있는 웹 애플리케이션입니다.

## 🚀 Live Demo

**Production:** [https://raccoonyy.github.io/awspirin/](https://raccoonyy.github.io/awspirin/)

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

## 📊 Analytics 설정

이 프로젝트는 Google Analytics 4 (GA4)와 Google Tag Manager (GTM)를 지원합니다.

### 환경변수 설정

`.env.local` 파일에 다음 환경변수를 설정하세요:

```bash
# Google Analytics 4 설정
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Google Tag Manager 설정 (선택사항)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Analytics 활성화/비활성화
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 동작 방식

1. **GTM만 설정된 경우**: GTM을 통해 모든 추적 관리
2. **GA4만 설정된 경우**: GA4 직접 연결로 추적
3. **둘 다 설정된 경우**: GTM을 우선 사용하고 GA4는 백업으로 활용
4. **둘 다 없는 경우**: 추적 비활성화

### 추적되는 이벤트

- `resource_toggle`: 리소스 선택/해제
- `action_toggle`: 권한 선택/해제  
- `arn_input`: ARN 입력
- `page_view`: 페이지 조회

## 📄 라이선스

MIT License
