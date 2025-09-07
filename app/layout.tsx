import './globals.css'
import { GTMNoScript } from '@/components/gtm-noscript'

export const metadata = {
  metadataBase: new URL('https://raccoonyy.github.io/awspirin'),
  title: 'AWSpirin - AWS IAM Policy Generator',
  description: '클릭만으로 편하게 AWS IAM 정책을 생성하세요. 의존성까지 자동으로 처리하는 무료 온라인 도구입니다.',
  keywords: 'AWS, IAM, Policy, Generator, 정책생성기, AWS권한, IAM정책, 클라우드보안',
  authors: [{ name: 'AWSpirin Team' }],
  creator: 'AWSpirin',
  publisher: 'AWSpirin',
  robots: 'index, follow',
  openGraph: {
    title: 'AWSpirin - AWS IAM Policy Generator',
    description: '클릭만으로 편하게 AWS IAM 정책을 생성하세요. 의존성까지 자동으로 처리하는 무료 온라인 도구입니다.',
    url: 'https://raccoonyy.github.io/awspirin',
    siteName: 'AWSpirin',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'AWSpirin - AWS IAM Policy Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AWSpirin - AWS IAM Policy Generator',
    description: '클릭만으로 편하게 AWS IAM 정책을 생성하세요.',
    images: ['/images/thumbnail.png'],
    creator: '@awspirin',
    site: '@awspirin',
  },
  alternates: {
    canonical: 'https://raccoonyy.github.io/awspirin',
    languages: {
      'ko': 'https://raccoonyy.github.io/awspirin?lang=ko',
      'en': 'https://raccoonyy.github.io/awspirin?lang=en',
      'ja': 'https://raccoonyy.github.io/awspirin?lang=ja',
      'zh': 'https://raccoonyy.github.io/awspirin?lang=zh',
    },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AWSpirin",
              "description": "클릭만으로 편하게 AWS IAM 정책을 생성하세요. 의존성까지 자동으로 처리하는 무료 온라인 도구입니다.",
              "url": "https://raccoonyy.github.io/awspirin",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "AWSpirin Team"
              },
              "inLanguage": ["ko", "en", "ja", "zh"],
              "keywords": "AWS, IAM, Policy, Generator, 정책생성기, AWS권한, IAM정책, 클라우드보안"
            })
          }}
        />
      </head>
      <body>
        <GTMNoScript />
        {children}
      </body>
    </html>
  )
}
