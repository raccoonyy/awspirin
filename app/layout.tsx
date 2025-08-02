import './globals.css'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics/google-tag-manager'

export const metadata = {
  title: 'AWS IAM Policy Generator',
  description: '시각적으로 AWS IAM 정책을 생성하고 관리하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false'

  return (
    <html lang="ko">
      <head>
        {gtmId && enableAnalytics && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && enableAnalytics && <GoogleTagManagerNoScript gtmId={gtmId} />}
        {children}
        {gtmId && enableAnalytics && <GoogleTagManager gtmId={gtmId} />}
      </body>
    </html>
  )
}
