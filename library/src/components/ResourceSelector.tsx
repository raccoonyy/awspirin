import { useState, useMemo } from 'react';
import { AWSResource } from '../types';

export interface ResourceSelectorProps {
  resources: AWSResource[];
  selected: string[];
  onSelect: (resourceId: string) => void;
  onDeselect: (resourceId: string) => void;
  searchable?: boolean;
  groupBy?: 'category' | 'alphabet' | 'none';
  className?: string;
}

export function ResourceSelector({
  resources,
  selected,
  onSelect,
  onDeselect,
  searchable = true,
  groupBy = 'category',
  className = '',
}: ResourceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => resources.filter((resource) => searchTerm === ''
      || resource.name.toLowerCase().includes(searchTerm.toLowerCase())
      || resource.service.toLowerCase().includes(searchTerm.toLowerCase())
      || resource.description?.toLowerCase().includes(searchTerm.toLowerCase())), [resources, searchTerm]);

  const groupedResources = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Resources': filteredResources };
    }

    if (groupBy === 'alphabet') {
      const groups: Record<string, AWSResource[]> = {};
      filteredResources.forEach((resource) => {
        const firstLetter = resource.name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(resource);
      });
      return groups;
    }

    const groups: Record<string, AWSResource[]> = {};
    filteredResources.forEach((resource) => {
      const category = resource.service.toUpperCase();
      if (!groups[category]) groups[category] = [];
      groups[category].push(resource);
    });
    return groups;
  }, [filteredResources, groupBy]);

  const handleToggle = (resourceId: string) => {
    if (selected.includes(resourceId)) {
      onDeselect(resourceId);
    } else {
      onSelect(resourceId);
    }
  };

  return (
    <div className={`resource-selector ${className}`}>
      <div className="resource-selector-header">
        <h3>AWS Resources</h3>
        {searchable && (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="resource-search"
            aria-label="Search AWS resources"
          />
        )}
      </div>

      <div className="resource-groups">
        {Object.entries(groupedResources).map(([groupName, groupResources]) => (
          <div key={groupName} className="resource-group">
            {groupBy !== 'none' && (
              <h4 className="group-header">{groupName}</h4>
            )}
            <div className="resource-list">
              {groupResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`resource-item ${selected.includes(resource.id) ? 'selected' : ''}`}
                >
                  <label className="resource-label">
                    <input
                      type="checkbox"
                      checked={selected.includes(resource.id)}
                      onChange={() => handleToggle(resource.id)}
                      className="resource-checkbox"
                    />
                    <div className="resource-content">
                      <div className="resource-main">
                        {resource.icon && (
                          <span className="resource-icon">{resource.icon}</span>
                        )}
                        <span className="resource-name">{resource.name}</span>
                        <span className="resource-service">
                          (
                          {resource.service}
                          )
                        </span>
                      </div>
                      {resource.description && (
                        <div className="resource-description">
                          {resource.description}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="no-resources">
          {searchTerm ? `No resources found for "${searchTerm}"` : 'No resources available'}
        </div>
      )}
    </div>
  );
}
