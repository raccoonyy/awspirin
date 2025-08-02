# 개발 가이드

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
- URL: `https://your-username.github.io/awspirin/`

### PR 미리보기
- 새 PR 생성 시 자동으로 미리보기 환경 생성
- URL: `https://your-username.github.io/awspirin/preview/branch-name/`
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

## 🤝 기여

이슈 리포트와 풀 리퀘스트를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
