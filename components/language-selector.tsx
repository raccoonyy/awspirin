"use client"

import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n, SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from '@/lib/i18n'

export function LanguageSelector() {
  const { locale, setLocale, isLoading } = useI18n()
  const [isChanging, setIsChanging] = useState(false)

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === locale || isChanging) return
    
    setIsChanging(true)
    try {
      await setLocale(newLocale)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isLoading || isChanging}
          className="h-8 px-3"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {LOCALE_NAMES[locale]}
          </span>
          <span className="sm:hidden">
            {locale.toUpperCase()}
          </span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <DropdownMenuItem
            key={supportedLocale}
            onClick={() => handleLocaleChange(supportedLocale)}
            className={`cursor-pointer ${
              locale === supportedLocale 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : ''
            }`}
          >
            {LOCALE_NAMES[supportedLocale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}