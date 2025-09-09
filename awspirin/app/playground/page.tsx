"use client"

import { useState } from "react"
import { PolicyGeneratorWrapper } from "@/components/policy-generator-wrapper"
import { I18nProvider } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Zap, Settings } from "lucide-react"

export default function PlaygroundPage() {
  const [generatedPolicy, setGeneratedPolicy] = useState<any>(null)

  const handlePolicyChange = (policy: any) => {
    setGeneratedPolicy(policy)
  }

  const handleCopy = (policyString: string) => {
    console.log('Policy copied:', policyString)
  }

  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-orange-500" />
                AWSpirin Playground
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Interactive demo - Test the policy generator with real-time preview
              </p>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Live Demo
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="demo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Interactive Demo
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Usage Examples
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              API Reference
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Policy Generator</CardTitle>
                <CardDescription>
                  Select AWS resources and actions to generate an IAM policy with automatic dependency resolution.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <PolicyGeneratorWrapper />
              </CardContent>
            </Card>

            {generatedPolicy && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Policy Output</CardTitle>
                  <CardDescription>
                    Real-time policy generated from your selections above
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(generatedPolicy, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic React Usage</CardTitle>
                  <CardDescription>Simple integration example</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{`import { PolicyGenerator } from 'awspirin-lib'

function App() {
  const handlePolicyChange = (policy) => {
    console.log('Generated policy:', policy)
  }

  return (
    <PolicyGenerator 
      onChange={handlePolicyChange}
      theme="light"
    />
  )
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Configuration</CardTitle>
                  <CardDescription>With custom resources and callbacks</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{`import { PolicyGenerator } from 'awspirin-lib'

function App() {
  const customResources = [
    // Your custom AWS service definitions
  ]

  return (
    <PolicyGenerator 
      services={customResources}
      onChange={(policy) => console.log(policy)}
      onCopy={(policyString) => navigator.clipboard.writeText(policyString)}
      theme="dark"
      layout="horizontal"
      maxStatements={10}
    />
  )
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>S3 Bucket Policy Example</CardTitle>
                  <CardDescription>Common use case with automatic dependencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{`// When you select "Read Objects" for S3:
// AWSpirin automatically includes:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",        // Auto-added dependency
        "s3:GetBucketLocation"  // Auto-added dependency
      ],
      "Resource": "arn:aws:s3:::your-bucket/*"
    }
  ]
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lambda Function Policy</CardTitle>
                  <CardDescription>Invoke functions with proper permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{`// When you select "Execute Functions" for Lambda:
// AWSpirin automatically includes:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction",
        "lambda:GetFunction"    // Auto-added dependency
      ],
      "Resource": "arn:aws:lambda:*:*:function:*"
    }
  ]
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>PolicyGenerator Props</CardTitle>
                  <CardDescription>Complete API reference for the main component</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Prop</th>
                          <th className="text-left p-2 font-medium">Type</th>
                          <th className="text-left p-2 font-medium">Default</th>
                          <th className="text-left p-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b">
                          <td className="p-2 font-mono">services</td>
                          <td className="p-2">AWSResource[]</td>
                          <td className="p-2">sampleResources</td>
                          <td className="p-2">AWS services and actions to display</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">onChange</td>
                          <td className="p-2">(policy: IAMPolicy) =&gt; void</td>
                          <td className="p-2">-</td>
                          <td className="p-2">Callback when policy changes</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">onCopy</td>
                          <td className="p-2">(policy: string) =&gt; void</td>
                          <td className="p-2">-</td>
                          <td className="p-2">Callback when policy is copied</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">theme</td>
                          <td className="p-2">'light' | 'dark'</td>
                          <td className="p-2">'light'</td>
                          <td className="p-2">Visual theme</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">layout</td>
                          <td className="p-2">'horizontal' | 'vertical' | 'responsive'</td>
                          <td className="p-2">'responsive'</td>
                          <td className="p-2">Component layout</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">maxStatements</td>
                          <td className="p-2">number</td>
                          <td className="p-2">50</td>
                          <td className="p-2">Maximum policy statements</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">arnInputMode</td>
                          <td className="p-2">'input' | 'dropdown' | 'both' | 'auto'</td>
                          <td className="p-2">'auto'</td>
                          <td className="p-2">ARN input method</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">className</td>
                          <td className="p-2">string</td>
                          <td className="p-2">''</td>
                          <td className="p-2">Additional CSS classes</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Type Definitions</CardTitle>
                  <CardDescription>TypeScript interfaces and types</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
{`interface IAMPolicy {
  Version: string
  Statement: PolicyStatement[]
}

interface PolicyStatement {
  Effect: 'Allow' | 'Deny'
  Action: string | string[]
  Resource: string | string[]
  Condition?: Record<string, any>
}

interface AWSResource {
  id: string
  name: string
  service: string
  icon?: string
  description?: string
  arnPattern?: string
  actions: AWSAction[]
}

interface AWSAction {
  id: string
  name: string
  description?: string
  category: 'read' | 'write' | 'admin'
  dependencies?: string[]
  requiresARN?: boolean
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </I18nProvider>
  )
}