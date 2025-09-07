import { useState, useMemo } from 'react';
import { AWSResource, AWSAction, ARNItem } from '../types';
import { ARNInput } from './ARNInput';

export interface ActionSelectorProps {
  resource: AWSResource;
  selectedActions: string[];
  arn?: string;
  arnList?: ARNItem[];
  onActionToggle: (action: string) => void;
  onARNChange: (arn: string) => void;
  onARNSelect?: (arn: string) => void;
  arnInputMode?: 'input' | 'dropdown' | 'both' | 'auto';
  showDependencies?: boolean;
  categories?: ('read' | 'write' | 'admin')[];
  className?: string;
}

export function ActionSelector({
  resource,
  selectedActions,
  arn = '',
  arnList = [],
  onActionToggle,
  onARNChange,
  onARNSelect,
  arnInputMode = 'auto',
  showDependencies = true,
  categories = ['read', 'write', 'admin'],
  className = '',
}: ActionSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const categorizedActions = useMemo(() => {
    const categorized: Record<string, AWSAction[]> = {};

    categories.forEach((category) => {
      categorized[category] = resource.actions.filter((action) => action.category === category
        && (searchTerm === ''
         || action.name.toLowerCase().includes(searchTerm.toLowerCase())
         || action.description?.toLowerCase().includes(searchTerm.toLowerCase())));
    });

    return categorized;
  }, [resource.actions, categories, searchTerm]);

  const selectedCount = useMemo(() => categories.reduce((acc, category) => {
    acc[category] = categorizedActions[category].filter((action) => selectedActions.includes(action.id)).length;
    return acc;
  }, {} as Record<string, number>), [categorizedActions, selectedActions, categories]);

  const handleSelectAll = (category: string) => {
    const categoryActions = categorizedActions[category];
    const allSelected = categoryActions.every((action) => selectedActions.includes(action.id));

    if (allSelected) {
      categoryActions.forEach((action) => {
        if (selectedActions.includes(action.id)) {
          onActionToggle(action.id);
        }
      });
    } else {
      categoryActions.forEach((action) => {
        if (!selectedActions.includes(action.id)) {
          onActionToggle(action.id);
        }
      });
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'read': return 'green';
      case 'write': return 'blue';
      case 'admin': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'read': return 'Read';
      case 'write': return 'Write';
      case 'admin': return 'Admin';
      default: return category;
    }
  };

  return (
    <div className={`action-selector ${className}`}>
      <div className="action-selector-header">
        <h3>
          {resource.name}
          {' '}
          Actions
        </h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search actions..."
          className="action-search"
          aria-label="Search actions"
        />
      </div>

      <div className="arn-section">
        <h4>Resource ARN</h4>
        <ARNInput
          value={arn}
          onChange={onARNChange}
          onSelect={onARNSelect}
          service={resource.service}
          arnList={arnList}
          mode={arnInputMode}
          className="action-arn-input"
        />
      </div>

      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
            style={{ borderColor: getCategoryColor(category) }}
          >
            <span className="category-name">{getCategoryLabel(category)}</span>
            <span className="category-count">
              {selectedCount[category]}
              /
              {categorizedActions[category].length}
            </span>
          </button>
        ))}
      </div>

      <div className="actions-content">
        {categories.map((category) => (
          <div
            key={category}
            className={`category-content ${activeCategory === category ? 'active' : ''}`}
          >
            <div className="category-header">
              <button
                type="button"
                className="select-all-btn"
                onClick={() => handleSelectAll(category)}
              >
                {selectedCount[category] === categorizedActions[category].length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div className="actions-list">
              {categorizedActions[category].map((action) => (
                <div
                  key={action.id}
                  className={`action-item ${selectedActions.includes(action.id) ? 'selected' : ''}`}
                >
                  <label className="action-label">
                    <input
                      type="checkbox"
                      checked={selectedActions.includes(action.id)}
                      onChange={() => onActionToggle(action.id)}
                      className="action-checkbox"
                    />
                    <div className="action-content">
                      <div className="action-main">
                        <span className="action-name">{action.name}</span>
                        {action.requiresARN && (
                          <span className="arn-required">ARN Required</span>
                        )}
                      </div>
                      {action.description && (
                        <div className="action-description">
                          {action.description}
                        </div>
                      )}
                      {showDependencies && action.dependencies && action.dependencies.length > 0 && (
                        <div className="action-dependencies">
                          <small>
                            Requires:
                            {action.dependencies.join(', ')}
                          </small>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {categorizedActions[category].length === 0 && (
              <div className="no-actions">
                {searchTerm
                  ? `No ${category} actions found for "${searchTerm}"`
                  : `No ${category} actions available`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
