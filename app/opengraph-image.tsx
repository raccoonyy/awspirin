import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'AWSpirin - AWS IAM Policy Generator'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #FFF4E6, #FFEDD5)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: 20,
          }}
        >
          AWSpirin
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#4B5563',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          클릭만으로 편하게 AWS IAM 정책을 생성하세요
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#6B7280',
            marginTop: 20,
          }}
        >
          (두통 없이) 의존성까지 자동으로 처리
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}