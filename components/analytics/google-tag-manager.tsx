'use client'

import { useEffect } from 'react'

interface GoogleTagManagerProps {
  gtmId: string
}

export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  useEffect(() => {
    // GTM이 이미 로드되었는지 확인
    if (typeof window !== 'undefined' && !window.dataLayer) {
      // dataLayer 초기화
      window.dataLayer = window.dataLayer || []
      
      // GTM 스크립트 동적 로드
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
      document.head.appendChild(script)
      
      // GTM 초기화
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      })
    }
  }, [gtmId])

  return null
}

// GTM noscript fallback 컴포넌트
export function GoogleTagManagerNoScript({ gtmId }: GoogleTagManagerProps) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

// 커스텀 이벤트 전송을 위한 유틸리티 함수
export const gtmEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters
    })
  }
}