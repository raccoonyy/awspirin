"use client"

import { useState } from "react"
import { Copy, Check, Package, Code2, Zap, Shield, Github, Star, Download } from "lucide-react"
import Link from "next/link"

export default function LibraryPage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'vue' | 'angular' | 'vanilla'>('react')

  const handleCopyCommand = async (command: string, id: string) => {
    await navigator.clipboard.writeText(command)
    setCopiedCommand(id)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const installCommands = {
    npm: 'npm install awspirin-lib',
    yarn: 'yarn add awspirin-lib',
    pnpm: 'pnpm add awspirin-lib'
  }

  const usageExamples = {
    react: `import { PolicyGenerator } from 'awspirin-lib'

function App() {
  const handlePolicyChange = (policy) => {
    console.log('Generated policy:', policy)
  }

  return (
    <PolicyGenerator
      onPolicyChange={handlePolicyChange}
      defaultResources={['s3', 'lambda']}
      theme="light"
    />
  )
}`,
    vue: `<template>
  <div>
    <PolicyGenerator
      @policy-change="handlePolicyChange"
      :default-resources="['s3', 'lambda']"
      theme="light"
    />
  </div>
</template>

<script>
import { PolicyGenerator } from 'awspirin-lib'

export default {
  components: { PolicyGenerator },
  methods: {
    handlePolicyChange(policy) {
      console.log('Generated policy:', policy)
    }
  }
}
</script>`,
    angular: `import { Component } from '@angular/core'
import { PolicyGenerator } from 'awspirin-lib'

@Component({
  selector: 'app-root',
  template: \`
    <policy-generator
      (policyChange)="handlePolicyChange($event)"
      [defaultResources]="['s3', 'lambda']"
      theme="light">
    </policy-generator>
  \`
})
export class AppComponent {
  handlePolicyChange(policy: any) {
    console.log('Generated policy:', policy)
  }
}`,
    vanilla: `<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { PolicyGenerator } from 'https://unpkg.com/awspirin-lib'
    
    const generator = new PolicyGenerator({
      container: '#policy-generator',
      onPolicyChange: (policy) => {
        console.log('Generated policy:', policy)
      },
      defaultResources: ['s3', 'lambda']
    })
  </script>
</head>
<body>
  <div id="policy-generator"></div>
</body>
</html>`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">AWS Policy Generator</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">LIBRARY</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Tool</Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
            <Link href="/examples" className="text-gray-600 hover:text-gray-900">Examples</Link>
            <Link href="/playground" className="text-gray-600 hover:text-gray-900">Playground</Link>
            <a href="https://github.com/awspirin/policy-generator" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Package className="w-12 h-12 text-orange-500" />
            <h1 className="text-5xl font-bold text-gray-900">awspirin-lib</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Drop-in React component library for AWS IAM policy generation
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">2.5k downloads/week</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">142 stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 font-medium">MIT License</span>
            </div>
          </div>

          {/* Quick Install */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">QUICK INSTALL</h3>
            <div className="space-y-2">
              {Object.entries(installCommands).map(([pkg, command]) => (
                <div key={pkg} className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-900 text-gray-100 px-4 py-3 rounded-lg font-mono text-sm">
                    {command}
                  </code>
                  <button
                    onClick={() => handleCopyCommand(command, pkg)}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedCommand === pkg ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Journey Flow */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Your Implementation Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Try the Tool</h3>
              <p className="text-sm text-gray-600">Experience the policy generator firsthand</p>
              <Link href="/" className="text-orange-600 text-sm font-medium mt-2 inline-block">
                Open Tool →
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Install Library</h3>
              <p className="text-sm text-gray-600">Add awspirin-lib to your project</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                npm install awspirin-lib
              </code>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Integrate</h3>
              <p className="text-sm text-gray-600">Drop the component into your app</p>
              <Link href="#usage" className="text-orange-600 text-sm font-medium mt-2 inline-block">
                See Examples →
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Customize</h3>
              <p className="text-sm text-gray-600">Tailor it to your needs</p>
              <Link href="/docs" className="text-orange-600 text-sm font-medium mt-2 inline-block">
                Read Docs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose awspirin-lib?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Dependency Resolution</h3>
              <p className="text-gray-600">Never miss required permissions. Our smart engine automatically includes all dependent actions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Framework Agnostic</h3>
              <p className="text-gray-600">Works seamlessly with React, Vue, Angular, or vanilla JavaScript.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Type-Safe</h3>
              <p className="text-gray-600">Full TypeScript support with comprehensive type definitions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section id="usage" className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Framework-Specific Guides</h2>
          
          {/* Framework Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(['react', 'vue', 'angular', 'vanilla'] as const).map((framework) => (
              <button
                key={framework}
                onClick={() => setSelectedFramework(framework)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFramework === framework
                    ? 'bg-white text-orange-600 shadow-lg'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {framework.charAt(0).toUpperCase() + framework.slice(1)}
                {framework === 'vanilla' && ' JS'}
              </button>
            ))}
          </div>

          {/* Code Example */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedFramework.charAt(0).toUpperCase() + selectedFramework.slice(1)}
                {selectedFramework === 'vanilla' && ' JavaScript'} Integration
              </h3>
              <button
                onClick={() => handleCopyCommand(usageExamples[selectedFramework], `example-${selectedFramework}`)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copiedCommand === `example-${selectedFramework}` ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{usageExamples[selectedFramework]}</code>
            </pre>
          </div>

          {/* Live Demo Links */}
          <div className="flex justify-center gap-4 mt-8">
            <a
              href={`https://codesandbox.io/s/awspirin-${selectedFramework}-demo`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open in CodeSandbox
            </a>
            <a
              href={`https://stackblitz.com/edit/awspirin-${selectedFramework}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Open in StackBlitz
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of developers using awspirin-lib for secure AWS policy generation
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/playground"
              className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Try in Playground
            </Link>
            <a
              href="https://github.com/awspirin/policy-generator"
              className="px-8 py-4 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}