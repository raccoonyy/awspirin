"use client"

import { useEffect, useMemo, useState, useCallback } from 'react';
import { AWSResource, AWSAction, IAMPolicy, PolicyStatement } from './types';

interface PolicyGeneratorProps {
  services: AWSResource[];
  onChange?: (policy: IAMPolicy) => void;
  onCopy?: (policy: string) => void;
  theme?: 'light' | 'dark';
  layout?: 'horizontal' | 'vertical' | 'responsive';
  className?: string;
  maxStatements?: number;
  arnInputMode?: 'input' | 'dropdown' | 'both' | 'auto';
}

interface Selection {
  resourceId: string;
  actions: string[];
  arn?: string;
}

export function PolicyGenerator({
  services,
  onChange,
  onCopy,
  theme = 'light',
  layout = 'responsive',
  className = '',
  maxStatements = 50,
  arnInputMode = 'auto',
}: PolicyGeneratorProps) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());

  // Generate policy from selections
  const policy = useMemo(() => {
    const statements: PolicyStatement[] = [];
    
    selections.forEach((selection) => {
      if (selection.actions.length > 0) {
        const resource = services.find(s => s.id === selection.resourceId);
        if (!resource) return;
        
        // Add dependencies automatically
        const allActions = new Set(selection.actions);
        selection.actions.forEach(actionId => {
          const action = resource.actions.find(a => a.id === actionId);
          if (action?.dependencies) {
            action.dependencies.forEach(dep => allActions.add(dep));
          }
        });
        
        statements.push({
          Effect: 'Allow',
          Action: Array.from(allActions),
          Resource: selection.arn || resource.arnPattern || '*',
        });
      }
    });

    return {
      Version: '2012-10-17',
      Statement: statements,
    };
  }, [selections, services]);

  // Notify parent of policy changes
  useEffect(() => {
    if (onChange) {
      onChange(policy);
    }
  }, [policy, onChange]);

  const addResource = useCallback((resourceId: string) => {
    if (!selectedResources.has(resourceId)) {
      setSelectedResources(prev => new Set([...prev, resourceId]));
      setSelections(prev => [...prev, { resourceId, actions: [] }]);
    }
  }, [selectedResources]);

  const removeResource = useCallback((resourceId: string) => {
    setSelectedResources(prev => {
      const newSet = new Set(prev);
      newSet.delete(resourceId);
      return newSet;
    });
    setSelections(prev => prev.filter(s => s.resourceId !== resourceId));
  }, []);

  const updateSelection = useCallback((resourceId: string, updates: Partial<Selection>) => {
    setSelections(prev => 
      prev.map(s => s.resourceId === resourceId ? { ...s, ...updates } : s)
    );
  }, []);

  const handleCopy = useCallback(() => {
    const policyString = JSON.stringify(policy, null, 2);
    navigator.clipboard.writeText(policyString);
    if (onCopy) {
      onCopy(policyString);
    }
  }, [policy, onCopy]);

  return (
    <div className={`policy-generator ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Resource Selection */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Select AWS Resources</h2>
          
          {/* Available Resources */}
          <div className="space-y-3">
            {services.map((resource) => (
              <div
                key={resource.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedResources.has(resource.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  if (selectedResources.has(resource.id)) {
                    removeResource(resource.id);
                  } else {
                    addResource(resource.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{resource.icon}</span>
                  <div>
                    <h3 className="font-medium">{resource.name}</h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Resources Configuration */}
          <div className="space-y-4">
            {selections.map((selection) => {
              const resource = services.find(s => s.id === selection.resourceId);
              if (!resource) return null;

              return (
                <div key={selection.resourceId} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <span>{resource.icon}</span>
                      {resource.name}
                    </h3>
                    <button
                      onClick={() => removeResource(selection.resourceId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  {/* ARN Input */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">ARN Pattern</label>
                    <input
                      type="text"
                      value={selection.arn || resource.arnPattern || ''}
                      onChange={(e) => updateSelection(selection.resourceId, { arn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder={resource.arnPattern}
                    />
                  </div>

                  {/* Actions */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Actions</label>
                    <div className="space-y-2">
                      {resource.actions.map((action) => (
                        <label key={action.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selection.actions.includes(action.id)}
                            onChange={(e) => {
                              const newActions = e.target.checked
                                ? [...selection.actions, action.id]
                                : selection.actions.filter(a => a !== action.id);
                              updateSelection(selection.resourceId, { actions: newActions });
                            }}
                          />
                          <span className={`px-2 py-1 rounded text-xs ${
                            action.category === 'read' ? 'bg-green-100 text-green-800' :
                            action.category === 'write' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {action.category}
                          </span>
                          <span>{action.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generated Policy</h2>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Copy Policy
            </button>
          </div>
          
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
            {JSON.stringify(policy, null, 2)}
          </pre>

          <div className="text-sm text-gray-600">
            <p>Statements: {policy.Statement.length}</p>
            <p>
              Total Actions: {policy.Statement.reduce((acc, stmt) => 
                acc + (Array.isArray(stmt.Action) ? stmt.Action.length : 1), 0
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}