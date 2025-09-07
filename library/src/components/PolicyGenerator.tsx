import { useEffect, useMemo } from 'react';
import { PolicyGeneratorProps } from '../types';
import { usePolicyGenerator } from '../hooks/usePolicyGenerator';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { ResourceSelector } from './ResourceSelector';
import { ActionSelector } from './ActionSelector';
import { PolicyPreview } from './PolicyPreview';
import { sampleResources } from '../data/sampleResources';

export function PolicyGenerator({
  services = sampleResources,
  defaultSelections = [],
  arnList = [],
  theme = 'light',
  layout = 'responsive',
  breakpoint = 768,
  onChange,
  onARNSelect,
  maxStatements = 50,
  arnInputMode = 'auto',
  className = '',
  styles = {},
}: PolicyGeneratorProps) {
  const {
    resources,
    selectedResources,
    selections,
    policy,
    addResource,
    selectResource,
    deselectResource,
    setActions,
    setARN,
    setARNList,
    getFilteredARNs,
  } = usePolicyGenerator(services);

  const currentLayout = useResponsiveLayout(layout, breakpoint);

  useEffect(() => {
    setARNList(arnList);
  }, [arnList, setARNList]);

  useEffect(() => {
    if (defaultSelections) {
      defaultSelections.forEach((selection) => {
        const resource = services.find((r) => r.id === selection.resourceId);
        if (resource) {
          addResource(resource);
          setActions(selection.resourceId, selection.actions);
          if (selection.arn) {
            setARN(selection.resourceId, selection.arn);
          }
        }
      });
    }
  }, [defaultSelections, services, addResource, setActions, setARN]);

  useEffect(() => {
    onChange?.(policy);
  }, [policy, onChange]);

  const handleARNChange = (resourceId: string, arn: string) => {
    setARN(resourceId, arn);
    onARNSelect?.(resourceId, arn);
  };

  const currentSelection = useMemo(() => (selectedResources.length > 0
    ? selections.find((s) => s.resourceId === selectedResources[0])
    : null), [selections, selectedResources]);

  const currentResource = useMemo(() => (currentSelection
    ? resources.find((r) => r.id === currentSelection.resourceId)
    : null), [currentSelection, resources]);

  const policyValid = policy.Statement.length <= maxStatements;

  const containerClasses = [
    'awspirin-lib',
    `theme-${theme}`,
    `layout-${currentLayout}`,
    className,
    !policyValid ? 'policy-invalid' : '',
  ].filter(Boolean).join(' ');

  const gridStyle = currentLayout === 'horizontal'
    ? { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }
    : { display: 'flex', flexDirection: 'column' as const, gap: '1rem' };

  return (
    <div className={containerClasses} style={{ ...gridStyle, ...styles.container }}>
      <div className="resource-section" style={styles.resourceSection}>
        <ResourceSelector
          resources={resources}
          selected={selectedResources}
          onSelect={selectResource}
          onDeselect={deselectResource}
          searchable
          groupBy="category"
          className="awspirin-lib-resource-selector"
        />
      </div>

      <div className="action-section" style={styles.actionSection}>
        {currentResource && currentSelection ? (
          <ActionSelector
            resource={currentResource}
            selectedActions={currentSelection.actions}
            arn={currentSelection.arn}
            arnList={getFilteredARNs(currentResource.service)}
            onActionToggle={(action) => {
              const newActions = currentSelection.actions.includes(action)
                ? currentSelection.actions.filter((a) => a !== action)
                : [...currentSelection.actions, action];
              setActions(currentSelection.resourceId, newActions);
            }}
            onARNChange={(arn) => handleARNChange(currentSelection.resourceId, arn)}
            onARNSelect={(arn) => handleARNChange(currentSelection.resourceId, arn)}
            arnInputMode={arnInputMode}
            showDependencies
            className="awspirin-lib-action-selector"
          />
        ) : (
          <div className="no-resource-selected" style={styles.placeholder}>
            <h3>Select a Resource</h3>
            <p>Choose an AWS resource from the left panel to configure its permissions.</p>
          </div>
        )}
      </div>

      <div className="policy-section" style={styles.policySection}>
        <PolicyPreview
          policy={policy}
          format="json"
          syntaxHighlight
          copyable
          downloadable
          className="awspirin-lib-preview"
        />

        {!policyValid && (
          <div className="policy-error" style={styles.error}>
            ⚠️ Policy exceeds maximum of
            {' '}
            {maxStatements}
            {' '}
            statements.
            Current:
            {' '}
            {policy.Statement.length}
          </div>
        )}
      </div>
    </div>
  );
}
