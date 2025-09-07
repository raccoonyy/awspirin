/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
const repoName = 'awspirin' // 저장소 이름을 직접 지정

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages 배포 시에만 basePath 적용
  ...(isProd && isGitHubPages && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  }),
  // CSS 최적화 비활성화 (정적 export에서 문제가 될 수 있음)
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig