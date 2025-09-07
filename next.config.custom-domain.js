/** @type {import('next').NextConfig} */
// 커스텀 도메인 사용 시 이 파일을 next.config.js로 이름 변경하세요
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 커스텀 도메인 사용 시 basePath 제거
}

module.exports = nextConfig