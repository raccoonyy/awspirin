"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useTranslation } from "@/lib/i18n"
import type { AWSResource, AWSAction } from "@/app/page"

interface ActionSelectorProps {
  selectedResources: AWSResource[]
  actions: Record<string, AWSAction[]>
  onActionToggle: (resourceId: string, actionId: string) => void
  onCategoryToggle: (resourceId: string, category: string, selected: boolean) => void
  onResourceActionsToggle: (resourceId: string, selected: boolean) => void
  onResourceArnChange: (resourceId: string, arn: string) => void
}

export function ActionSelector({
  selectedResources,
  actions,
  onActionToggle,
  onCategoryToggle,
  onResourceActionsToggle,
  onResourceArnChange,
}: ActionSelectorProps) {
  const t = useTranslation()

  const totalSelectedActions = Object.values(actions)
    .flat()
    .filter((a) => a.selected).length



  const handleActionClick = (resourceId: string, action: AWSAction) => {
    onActionToggle(resourceId, action.id)
  }

  const getCategoryActions = (resourceId: string, category: string) => {
    return actions[resourceId]?.filter((a) => a.category === category) || []
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "read":
        return t('actions.categories.read')
      case "write":
        return t('actions.categories.write')
      case "admin":
        return t('actions.categories.admin')
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "read":
        return "text-green-700 bg-green-50 border-green-200"
      case "write":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "admin":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getCategorySelectedCount = (resourceId: string, category: string) => {
    return getCategoryActions(resourceId, category).filter((a) => a.selected).length
  }

  const getResourceSelectedCount = (resourceId: string) => {
    return actions[resourceId]?.filter((a) => a.selected).length || 0
  }

  const getResourceTotalCount = (resourceId: string) => {
    return actions[resourceId]?.length || 0
  }

  if (selectedResources.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('actions.title')}</h2>
          <p className="text-sm text-gray-600 mt-1">{t('actions.subtitle')}</p>
        </div>

        <div className="p-6">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">{t('actions.selectResource')}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">{t('actions.title')}</h2>
            {totalSelectedActions > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {t('actions.selectedCount', { count: totalSelectedActions })}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{t('actions.subtitle')}</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {selectedResources.map((resource) => {
              const selectedCount = getResourceSelectedCount(resource.id)
              const totalCount = getResourceTotalCount(resource.id)

              return (
                <Card key={resource.id} className="border-gray-200">
                  <CardContent className="p-0">
                    {/* 리소스 헤더 */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">{resource.icon}</div>
                          <div>
                            <h3 className="font-medium text-gray-900">{resource.name}</h3>
                            <p className="text-xs text-gray-600">
                              {t('actions.actionsSelected', { selected: selectedCount, total: totalCount })}
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedCount === totalCount && totalCount > 0}
                          onCheckedChange={(checked) => onResourceActionsToggle(resource.id, checked as boolean)}
                        />
                      </div>
                      
                      {/* ARN 입력 필드 */}
                      <div className="space-y-2">
                        <label htmlFor={`arn-${resource.id}`} className="text-sm font-medium text-gray-700">
                          {resource.name} {t('actions.arnLabel')}
                        </label>
                        <Input
                          id={`arn-${resource.id}`}
                          placeholder={
                            resource.id === 's3' 
                              ? t('actions.arnPlaceholder.s3')
                              : resource.id === 'dynamodb'
                              ? t('actions.arnPlaceholder.dynamodb')
                              : resource.id === 'cloudwatch'
                              ? t('actions.arnPlaceholder.cloudwatch')
                              : t('actions.arnPlaceholder.default').replace('{service}', resource.id)
                          }
                          value={resource.arn || ""}
                          onChange={(e) => onResourceArnChange(resource.id, e.target.value)}
                          className="text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          {resource.id === 's3' 
                            ? t('actions.arnHelp.s3')
                            : resource.id === 'dynamodb'
                            ? t('actions.arnHelp.dynamodb')
                            : resource.id === 'cloudwatch'
                            ? t('actions.arnHelp.cloudwatch')
                            : t('actions.arnHelp.default')
                          }
                        </p>
                      </div>
                    </div>

                    {/* 권한 목록 */}
                    <div className="p-4">
                      {["read", "write", "admin"].map((category) => {
                        const categoryActions = getCategoryActions(resource.id, category)
                        if (categoryActions.length === 0) return null

                        const categorySelectedCount = getCategorySelectedCount(resource.id, category)

                        return (
                          <div key={category} className="mb-4 last:mb-0">
                            <div className={`flex items-center justify-between py-2 px-3 mb-2 rounded border ${getCategoryColor(category)}`}>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-medium">
                                  {getCategoryLabel(category)}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {categorySelectedCount}/{categoryActions.length}
                                </Badge>
                              </div>
                              <Checkbox
                                checked={categorySelectedCount === categoryActions.length}
                                onCheckedChange={(checked) =>
                                  onCategoryToggle(resource.id, category, checked as boolean)
                                }
                              />
                            </div>
                            
                            <div className="ml-4 space-y-2">
                              {categoryActions.map((action) => (
                                <div
                                  key={action.id}
                                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                  onClick={() => handleActionClick(resource.id, action)}
                                >
                                  <Checkbox
                                    checked={action.selected}
                                    onCheckedChange={() => handleActionClick(resource.id, action)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900">{action.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                                    <div className="text-xs text-gray-400 mt-1 font-mono">
                                      {action.actions.join(", ")}
                                      {action.dependencies && action.dependencies.length > 0 && (
                                        <span className="text-orange-500"> + {action.dependencies.join(", ")}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
    </div>
  )
}