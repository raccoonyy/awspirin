"use client"

import { useState } from "react"
import { Copy, Check, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "@/lib/i18n"
import type { AWSResource, AWSAction } from "@/app/page"

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

      // GTM 이벤트 전송
      if (typeof window !== 'undefined' && window.dataLayer) {
        const statements = getPolicyStatements()
        window.dataLayer.push({
          event: 'policy_copy',
          policy_statements_count: statements.length,
          selected_resources_count: selectedResources.length,
          selected_actions_count: selectedActions.length,
          total_aws_actions_count: getAllAwsActions().length
        })
      }
    }
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('policy.title')}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!policy} className="h-8 bg-transparent">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
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
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
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
  )
}