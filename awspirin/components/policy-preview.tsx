"use client"

import { useState, useEffect, useRef } from "react"
import { Copy, Check, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTranslation } from "@/lib/i18n"
import { InstallLibraryModal } from "./install-library-modal"
import type { AWSResource, AWSAction } from "@/lib/types"

interface PolicyPreviewProps {
  selectedResources: AWSResource[]
  selectedActions: AWSAction[]
  getAllAwsActions: () => string[]
  getPolicyResources: () => string | string[]
  getPolicyStatements: () => any[]
}

export function PolicyPreview({ selectedResources, selectedActions, getAllAwsActions, getPolicyResources, getPolicyStatements }: PolicyPreviewProps) {
  const t = useTranslation()
  const [copied, setCopied] = useState(false)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const prevSelectedResourcesRef = useRef<AWSResource[]>([])
  const prevSelectedActionsRef = useRef<AWSAction[]>([])

  // 선택된 액션이 변경될 때 하이라이팅 효과
  useEffect(() => {
    // 액션 변경 감지
    const actionsChanged =
      selectedActions.length !== prevSelectedActionsRef.current.length ||
      selectedActions.some((action, index) =>
        prevSelectedActionsRef.current[index]?.id !== action.id ||
        (prevSelectedActionsRef.current[index] as any)?.selected !== (action as any).selected
      )

    if (actionsChanged) {
      // 첫 번째 렌더링이 아닐 때만 하이라이팅
      if (prevSelectedActionsRef.current.length > 0) {
        setIsHighlighted(true)

        // 카드로 스크롤 (부드럽게)
        if (cardRef.current) {
          cardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }

        // 1.5초 후 하이라이팅 제거
        const timer = setTimeout(() => {
          setIsHighlighted(false)
        }, 1500)

        return () => clearTimeout(timer)
      }
    }

    // 이전 값들 업데이트
    prevSelectedActionsRef.current = [...selectedActions]
  }, [selectedActions])

  // ARN 변경 시 하이라이팅 효과
  useEffect(() => {
    // ARN 변경 감지
    const arnChanged = selectedResources.some((resource, index) =>
      (prevSelectedResourcesRef.current[index] as any)?.arn !== (resource as any).arn
    )

    if (arnChanged) {
      // 첫 번째 렌더링이 아닐 때만 하이라이팅
      if (prevSelectedResourcesRef.current.length > 0) {
        setIsHighlighted(true)

        // 카드로 스크롤 (부드럽게)
        if (cardRef.current) {
          cardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }

        // 1.5초 후 하이라이팅 제거
        const timer = setTimeout(() => {
          setIsHighlighted(false)
        }, 1500)

        return () => clearTimeout(timer)
      }
    }

    // 이전 값들 업데이트
    prevSelectedResourcesRef.current = [...selectedResources]
  }, [selectedResources])

  const generatePolicy = () => {
    if (selectedActions.length === 0) {
      return null
    }

    const statements = getPolicyStatements()

    if (statements.length === 0) {
      return null
    }

    const policy = {
      Version: "2012-10-17",
      Statement: statements,
    }

    return JSON.stringify(policy, null, 2)
  }

  const policy = generatePolicy()
  const isValid = selectedActions.length > 0

  const handleCopy = async () => {
    if (policy) {
      await navigator.clipboard.writeText(policy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Show install modal after copying
      setTimeout(() => {
        setShowInstallModal(true)
      }, 1000)

      // GA4 이벤트 전송
      if (typeof window !== 'undefined' && window.gtag) {
        const statements = getPolicyStatements()
        window.gtag('event', 'copied', {
          policy_statements_count: statements.length,
          selected_resources_count: selectedResources.length,
          selected_actions_count: selectedActions.length,
          total_aws_actions_count: getAllAwsActions().length
        })
      }
    }
  }

  return (
    <>
      <Card
        ref={cardRef}
        className={`border-gray-200 transition-all duration-200 ease-in-out ${isHighlighted
          ? 'ring-2 ring-yellow-300 ring-opacity-90 shadow-lg border-yellow-200 bg-yellow-100/50'
          : ''
          }`}
      >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg transition-colors duration-200 ease-in-out ${isHighlighted ? 'text-yellow-600' : ''
            }`}>
            {t('policy.title')}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!policy} className="h-8 bg-transparent">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('policy.copyTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        {policy ? (
          <>
            <div className="mb-4">
              {isValid ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{t('policy.valid')}</AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{t('policy.selectActions')}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="relative">
              <pre className="bg-white border border-gray-200 text-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{policy}</code>
              </pre>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>• {t('policy.summary.totalActions', { count: selectedActions.length })}</p>
              <p>• {t('policy.summary.awsActions', { count: getAllAwsActions().length })}</p>
              <p>• {t('policy.summary.statements', { count: getPolicyStatements().length })}</p>
              <p>• {t('policy.summary.resources.label')}: {
                (() => {
                  const statements = getPolicyStatements()
                  const hasWildcard = statements.some(s => s.Resource === "*")
                  const hasSpecificArn = statements.some(s => s.Resource !== "*")

                  if (hasWildcard && hasSpecificArn) return t('policy.summary.resources.mixed')
                  if (hasWildcard) return t('policy.summary.resources.allResources')
                  if (hasSpecificArn) return t('policy.summary.resources.specificArn')
                  return t('policy.summary.resources.none')
                })()
              }</p>

              {/* 입력된 ARN 목록 표시 */}
              {(() => {
                const resourcesWithArn = selectedResources.filter(resource =>
                  (resource as any).arn && (resource as any).arn.trim() !== ''
                )

                if (resourcesWithArn.length > 0) {
                  return (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-medium text-gray-600 mb-2">입력된 ARN:</p>
                      <div className="space-y-1">
                        {resourcesWithArn.map((resource) => (
                          <div key={resource.id} className="flex items-start space-x-2">
                            <span className="text-lg">{resource.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-700">{resource.name}</p>
                              <p className="font-mono text-xs text-gray-600 break-all">
                                {(resource as any).arn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <AlertCircle className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-gray-500 text-sm">{t('policy.noActionsSelected')}</p>
          </div>
        )}
      </CardContent>
    </Card>
    <InstallLibraryModal 
      isOpen={showInstallModal} 
      onClose={() => setShowInstallModal(false)} 
    />
    </>
  )
}