"use client"

import Script from 'next/script'

// GTM과 GA4를 위한 타입 정의
type WindowWithAnalytics = Window & {
  dataLayer?: any[]
  gtag?: (...args: any[]) => void
}

export function Analytics() {
  // 환경변수에서 ID들을 가져오기
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-L0TPTZ8WCY'
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
  const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false'

  // 디버깅을 위한 콘솔 로그 (프로덕션에서는 제거 예정)
  console.log('Analytics Debug:', { 
    GA4_ID, 
    GTM_ID,
    ENABLE_ANALYTICS,
    env_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    env_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    env_ENABLE: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS
  })

  if (!ENABLE_ANALYTICS) {
    console.log('Analytics disabled by environment variable')
    return null
  }

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        </>
      )}

      {/* GTM이 없는 경우에만 GA4 직접 연결 */}
      {GA4_ID && !GTM_ID && (
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
      )}
    </>
  )
}

// 이벤트 전송 함수 (GTM과 GA4 모두 지원)
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    const win = window as WindowWithAnalytics
    
    // GTM이 있는 경우 dataLayer로 전송
    if (win.dataLayer) {
      win.dataLayer.push({
        event: eventName,
        ...parameters
      })
    }
    
    // GA4 직접 연결이 있는 경우 gtag로도 전송
    if (win.gtag) {
      win.gtag('event', eventName, parameters)
    }
  }
}

// 페이지뷰 추적 함수
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined') {
    const win = window as WindowWithAnalytics
    const pageData = {
      page_title: title || document.title,
      page_location: url,
    }
    
    // GTM이 있는 경우 dataLayer로 전송
    if (win.dataLayer) {
      win.dataLayer.push({
        event: 'page_view',
        ...pageData
      })
    }
    
    // GA4 직접 연결이 있는 경우
    const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
    if (win.gtag && GA4_ID) {
      win.gtag('config', GA4_ID, pageData)
    }
  }
}

// GTM 커스텀 이벤트 전송 함수
export const trackGTMEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    const win = window as WindowWithAnalytics
    if (win.dataLayer) {
      win.dataLayer.push({
        event: eventName,
        ...eventData
      })
    }
  }
}