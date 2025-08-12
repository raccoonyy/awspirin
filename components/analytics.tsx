"use client"

import Script from 'next/script'

export function Analytics() {
  // 환경변수에서 GA4_ID를 가져오되, 없으면 하드코딩된 값 사용 (임시)
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-L0TPTZ8WCY'
  const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false'

  // 디버깅을 위한 콘솔 로그 (프로덕션에서는 제거 예정)
  console.log('Analytics Debug:', { 
    GA4_ID, 
    ENABLE_ANALYTICS,
    env_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    env_ENABLE: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS
  })

  if (!GA4_ID) {
    console.warn('Analytics not loaded: No GA4_ID')
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// GA4 이벤트 전송 함수
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// 페이지뷰 추적 함수
export const trackPageView = (url: string, title?: string) => {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
  if (typeof window !== 'undefined' && window.gtag && GA4_ID) {
    window.gtag('config', GA4_ID, {
      page_title: title || document.title,
      page_location: url,
    })
  }
}