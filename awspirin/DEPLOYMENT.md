# 배포 가이드

이 문서는 AWS IAM Policy Generator를 GitHub Pages에 배포하는 방법을 설명합니다.

## 🚀 자동 배포 설정

### 1. GitHub Repository 설정

1. GitHub에서 새 repository를 생성합니다
2. 로컬 코드를 repository에 푸시합니다:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/awspirin.git
git push -u origin main
```

### 2. GitHub Pages 활성화

1. Repository의 **Settings** 탭으로 이동
2. 왼쪽 메뉴에서 **Pages** 선택
3. **Source**를 **GitHub Actions**로 설정

### 3. 권한 설정

Repository Settings에서 다음 권한을 확인하세요:

1. **Settings** → **Actions** → **General**
2. **Workflow permissions**에서 다음을 선택:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

## 📋 배포 워크플로우

### Main Branch 배포
- `main` 브랜치에 코드가 푸시되면 자동으로 배포
- 배포 URL: `https://YOUR_USERNAME.github.io/awspirin/`

### PR 미리보기 배포
- 새 PR이 생성되면 자동으로 미리보기 환경 생성
- 미리보기 URL: `https://YOUR_USERNAME.github.io/awspirin/preview/BRANCH_NAME/`
- PR 코멘트에 미리보기 링크 자동 추가

### 자동 정리
- PR이 닫히거나 머지되면 미리보기 환경 자동 삭제
- 매일 오전 2시(UTC)에 오래된 미리보기 환경 정리

## 🔧 설정 파일 설명

### `.github/workflows/deploy.yml`
메인 배포 워크플로우:
- **build**: Next.js 앱 빌드 및 정적 파일 생성
- **deploy-main**: main 브랜치 배포
- **deploy-preview**: PR 미리보기 배포
- **cleanup-preview**: PR 종료 시 미리보기 정리

### `.github/workflows/cleanup-previews.yml`
오래된 미리보기 환경 정리:
- 매일 자동 실행
- 닫힌 PR의 미리보기 디렉토리 삭제

### `next.config.js`
GitHub Pages 배포를 위한 Next.js 설정:
- 정적 파일 생성 (`output: 'export'`)
- 기본 경로 설정 (`basePath`)
- 이미지 최적화 비활성화

## 🐛 문제 해결

### 배포 실패 시
1. **Actions** 탭에서 실패한 워크플로우 확인
2. 로그를 확인하여 오류 원인 파악
3. 일반적인 문제들:
   - 권한 부족: Repository 설정에서 Actions 권한 확인
   - 빌드 오류: 로컬에서 `npm run build` 테스트
   - 경로 문제: `next.config.js`의 `basePath` 설정 확인

### 미리보기가 생성되지 않을 때
1. PR이 `main` 브랜치를 대상으로 하는지 확인
2. Actions 권한이 올바르게 설정되었는지 확인
3. 브랜치 이름에 특수문자가 있는 경우 자동으로 하이픈으로 변환됨

### 정적 파일 경로 문제
GitHub Pages에서는 상대 경로를 사용해야 합니다:
- ✅ 올바른 예: `./assets/image.png`
- ❌ 잘못된 예: `/assets/image.png`

## 📊 모니터링

### 배포 상태 확인
- Repository의 **Actions** 탭에서 워크플로우 실행 상태 확인
- **Environments** 탭에서 배포 히스토리 확인

### 사용량 모니터링
- **Insights** → **Traffic**에서 방문자 통계 확인
- GitHub Pages는 월 100GB 대역폭 제한 있음

## 🔄 업데이트 프로세스

1. 로컬에서 변경사항 개발
2. 새 브랜치 생성 및 PR 생성
3. 미리보기 환경에서 테스트
4. 리뷰 후 `main` 브랜치에 머지
5. 자동으로 프로덕션 배포

## 📝 커스텀 도메인 (선택사항)

커스텀 도메인을 사용하려면:

1. DNS 설정에서 CNAME 레코드 추가:
   ```
   your-domain.com → YOUR_USERNAME.github.io
   ```

2. Repository Settings → Pages에서 커스텀 도메인 설정

3. `next.config.js`에서 `basePath` 제거:
   ```javascript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: { unoptimized: true },
     // basePath 제거
   }
   ```