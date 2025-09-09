"use client"

import { PolicyGeneratorWrapper } from "@/components/policy-generator-wrapper"
import { LanguageSelector } from "@/components/language-selector"
import { Analytics } from "@/components/analytics"
import { I18nProvider, useI18n, useTranslation } from "@/lib/i18n"

function PageContent() {
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">{t('header.subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.open('/library', '_self')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
              >
                📦 Embed this in your site
              </button>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-12" style={{ background: 'linear-gradient(to right, #FFF4E6, #FFEDD5)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('hero.mainTitle')}</h2>
          <p className="text-xl text-gray-600">{t('hero.subTitle')}</p>
        </div>
      </section>

      {/* Policy Generator */}
      <PolicyGeneratorWrapper />
    </div>
  )
}

export default function Home() {
  return (
    <I18nProvider>
      <PageContent />
      <Analytics />
    </I18nProvider>
  )
}