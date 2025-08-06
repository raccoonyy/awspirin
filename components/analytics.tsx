"use client"

import Script from 'next/script'

export function Analytics() {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
  const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'

  if (!GA4_ID || !ENABLE_ANALYTICS) {
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