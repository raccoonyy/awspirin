"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Locale, Translations, TranslationFunction } from './types'
import { ko } from './locales/ko'
import { 
  DEFAULT_LOCALE, 
  detectBrowserLocale, 
  getStoredLocale, 
  setStoredLocale,
  createTranslationFunction 
} from './utils'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationFunction
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE)
  const [translations, setTranslations] = useState<Translations>(ko)
  const [isLoading, setIsLoading] = useState(true)

  // 번역 로드 함수
  const loadTranslations = async (targetLocale: Locale): Promise<Translations> => {
    try {
      switch (targetLocale) {
        case 'ko':
          return ko
        case 'en':
          const { en } = await import('./locales/en')
          return en
        case 'ja':
          const { ja } = await import('./locales/ja')
          return ja
        case 'zh':
          // 중국어 번역이 아직 없으므로 한국어로 폴백
          console.warn('Chinese translation not available, falling back to Korean')
          return ko
        default:
          return ko
      }
    } catch (error) {
      console.warn(`Failed to load translations for ${targetLocale}, falling back to Korean:`, error)
      return ko
    }
  }

  // 언어 변경 함수
  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return
    
    setIsLoading(true)
    try {
      const newTranslations = await loadTranslations(newLocale)
      setTranslations(newTranslations)
      setLocaleState(newLocale)
      setStoredLocale(newLocale)
    } catch (error) {
      console.error('Failed to change locale:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 언어 설정
  useEffect(() => {
    const initializeLocale = async () => {
      let targetLocale: Locale = initialLocale || DEFAULT_LOCALE
      
      if (!initialLocale) {
        // 저장된 언어 설정 확인
        const storedLocale = getStoredLocale()
        if (storedLocale) {
          targetLocale = storedLocale
        } else {
          // 저장된 설정이 없으면 브라우저 언어 감지
          targetLocale = detectBrowserLocale()
        }
      }
      
      if (targetLocale !== locale) {
        await setLocale(targetLocale)
      } else {
        setIsLoading(false)
      }
    }
    
    initializeLocale()
  }, [initialLocale])

  // 번역 함수 생성
  const t = createTranslationFunction(translations)

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isLoading
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// 커스텀 훅
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// 번역 전용 훅 (더 간단한 사용을 위해)
export function useTranslation(): TranslationFunction {
  const { t } = useI18n()
  return t
}