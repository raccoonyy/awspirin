"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { AWSResource } from "@/app/page"

interface ResourceSelectorProps {
  resources: AWSResource[]
  onResourceToggle: (resourceId: string) => void
}

export function ResourceSelector({ resources, onResourceToggle }: ResourceSelectorProps) {
  const selectedCount = resources.filter((r) => r.selected).length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">AWS 리소스 선택</h2>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount}개 선택됨
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">정책을 적용할 AWS 서비스를 선택하세요.</p>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                resource.selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onResourceToggle(resource.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{resource.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">{resource.name}</h3>
                      <Checkbox
                        checked={resource.selected}
                        onCheckedChange={() => onResourceToggle(resource.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}