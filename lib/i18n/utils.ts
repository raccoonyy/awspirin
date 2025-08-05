import type { Locale, Translations, TranslationFunction } from './types'

// 기본 언어
export const DEFAULT_LOCALE: Locale = 'ko'

// 지원하는 언어 목록
export const SUPPORTED_LOCALES: Locale[] = ['ko', 'en', 'ja', 'zh']

// 언어 이름 매핑
export const LOCALE_NAMES: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文'
}

// 브라우저 언어 감지
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  
  const browserLang = navigator.language.toLowerCase()
  
  // 정확한 매치 확인
  if (SUPPORTED_LOCALES.includes(browserLang as Locale)) {
    return browserLang as Locale
  }
  
  // 언어 코드만 확인 (예: en-US -> en)
  const langCode = browserLang.split('-')[0] as Locale
  if (SUPPORTED_LOCALES.includes(langCode)) {
    return langCode
  }
  
  return DEFAULT_LOCALE
}

// 로컬 스토리지에서 언어 설정 가져오기
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('awspirin-locale')
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      return stored as Locale
    }
  } catch (error) {
    console.warn('Failed to get stored locale:', error)
  }
  
  return null
}

// 로컬 스토리지에 언어 설정 저장
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('awspirin-locale', locale)
  } catch (error) {
    console.warn('Failed to store locale:', error)
  }
}

// 중첩된 객체에서 키로 값 가져오기
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

// 번역 함수 생성
export function createTranslationFunction(translations: Translations): TranslationFunction {
  return (key: string, params?: Record<string, string | number>): string => {
    let translation = getNestedValue(translations, key)
    
    // 번역이 없으면 키를 그대로 반환
    if (typeof translation !== 'string') {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    
    // 매개변수 치환
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value))
      })
    }
    
    return translation
  }
}

// 언어별 숫자 포맷팅
export function formatNumber(num: number, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN'
  }
  
  return new Intl.NumberFormat(localeMap[locale]).format(num)
}

// 언어별 날짜 포맷팅
export function formatDate(date: Date, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN'
  }
  
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}