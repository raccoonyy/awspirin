"use client"

import { useState, useEffect } from "react"
import { X, Copy, Check, Code2, Package, Zap } from "lucide-react"

interface InstallLibraryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstallLibraryModal({ isOpen, onClose }: InstallLibraryModalProps) {
  const [copied, setCopied] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'npm' | 'yarn' | 'pnpm'>('npm')

  const installCommands = {
    npm: 'npm install awspirin-lib',
    yarn: 'yarn add awspirin-lib',
    pnpm: 'pnpm add awspirin-lib'
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommands[selectedTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Use this in your application!</h2>
                <p className="text-orange-100 mt-1">Integrate AWS Policy Generator into your project</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Installation</h3>
              <div className="flex gap-2 mb-3">
                {(['npm', 'yarn', 'pnpm'] as const).map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setSelectedTab(pkg)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === pkg
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <code>{installCommands[selectedTab]}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
              <pre className="bg-gray-50 border border-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <code className="text-gray-800">{`import { PolicyGenerator } from 'awspirin-lib'

function App() {
  return (
    <PolicyGenerator
      onPolicyChange={(policy) => console.log(policy)}
      defaultResources={['s3', 'lambda']}
    />
  )
}`}</code>
              </pre>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-sm">Lightweight</h4>
                <p className="text-xs text-gray-600 mt-1">Only 45KB minified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Code2 className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-sm">TypeScript</h4>
                <p className="text-xs text-gray-600 mt-1">Full type support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-sm">Tree-shakeable</h4>
                <p className="text-xs text-gray-600 mt-1">Import only what you need</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="/library"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-center"
              >
                View Documentation
              </a>
              <a
                href="/examples"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                See Examples
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}