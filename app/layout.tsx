import './globals.css'

export const metadata = {
  title: 'AWS IAM Policy Generator',
  description: '시각적으로 AWS IAM 정책을 생성하고 관리하세요',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
