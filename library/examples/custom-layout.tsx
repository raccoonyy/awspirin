import React from 'react';
import {
  ResourceSelector,
  ActionSelector,
  PolicyPreview,
  usePolicyGenerator,
  sampleResources,
  ARNItem,
} from '../src';

const CustomLayoutExample: React.FC = () => {
  const arnList: ARNItem[] = [
    {
      arn: 'arn:aws:s3:::custom-bucket/*',
      service: 's3',
      displayName: 'Custom Bucket',
    },
    {
      arn: 'arn:aws:ec2:us-east-1:123456789012:instance/i-custom123',
      service: 'ec2',
      displayName: 'Custom EC2 Instance',
    },
  ];

  const {
    resources,
    selectedResources,
    selections,
    policy,
    selectResource,
    deselectResource,
    setActions,
    setARN,
    setARNList,
    getFilteredARNs,
  } = usePolicyGenerator(sampleResources);

  React.useEffect(() => {
    setARNList(arnList);
  }, [setARNList]);

  const currentSelection = selections.find(s => s.resourceId === selectedResources[0]);
  const currentResource = currentSelection 
    ? resources.find(r => r.id === currentSelection.resourceId)
    : null;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Custom Layout Example</h1>
      <p>This example shows how to use individual components to create a custom layout.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 400px', gap: '20px', minHeight: '600px' }}>
        {/* Left sidebar - Resource selection */}
        <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
          <ResourceSelector
            resources={resources}
            selected={selectedResources}
            onSelect={selectResource}
            onDeselect={deselectResource}
            searchable
            groupBy="category"
          />
        </div>

        {/* Center - Action configuration */}
        <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
          {currentResource && currentSelection ? (
            <ActionSelector
              resource={currentResource}
              selectedActions={currentSelection.actions}
              arn={currentSelection.arn}
              arnList={getFilteredARNs(currentResource.service)}
              onActionToggle={(action) => {
                const newActions = currentSelection.actions.includes(action)
                  ? currentSelection.actions.filter(a => a !== action)
                  : [...currentSelection.actions, action];
                setActions(currentSelection.resourceId, newActions);
              }}
              onARNChange={(arn) => setARN(currentSelection.resourceId, arn)}
              arnInputMode="auto"
              showDependencies
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>Select a Resource</h3>
              <p>Choose an AWS resource from the left to configure its permissions.</p>
            </div>
          )}
        </div>

        {/* Right sidebar - Policy preview */}
        <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
          <PolicyPreview
            policy={policy}
            format="json"
            syntaxHighlight
            copyable
            downloadable
          />
          
          <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Policy Stats</h4>
            <div style={{ fontSize: '12px', color: '#888' }}>
              <div>Resources Selected: {selectedResources.length}</div>
              <div>Total Actions: {selections.reduce((acc, s) => acc + s.actions.length, 0)}</div>
              <div>Statements: {policy.Statement.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: '#f0f7ff', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>Custom Layout Benefits</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af' }}>
          <li>Complete control over component placement and styling</li>
          <li>Ability to add custom UI elements between components</li>
          <li>Integration with existing design systems</li>
          <li>Custom responsive breakpoints and layouts</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomLayoutExample;