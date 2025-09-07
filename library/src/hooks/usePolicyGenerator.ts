import { useState, useCallback, useMemo } from 'react';
import { PolicyCore } from '../core/PolicyCore';
import {
  AWSResource,
  IAMPolicy,
  ARNItem,
  Selection,
} from '../types';
import { getStaticDependencies, resolveDependencies } from '../utils/dependencies';

export interface PolicyGeneratorAPI {
  resources: AWSResource[];
  selectedResources: string[];
  selections: Selection[];
  arnList: ARNItem[];
  policy: IAMPolicy;

  addResource: (resource: AWSResource) => void;
  removeResource: (resourceId: string) => void;
  selectResource: (resourceId: string) => void;
  deselectResource: (resourceId: string) => void;
  setActions: (resourceId: string, actions: string[]) => void;
  setARN: (resourceId: string, arn: string) => void;
  setARNList: (arns: ARNItem[]) => void;
  getFilteredARNs: (service: string, resourceType?: string) => ARNItem[];
  reset: () => void;
}

export function usePolicyGenerator(
  initialResources: AWSResource[] = [],
): PolicyGeneratorAPI {
  const [core] = useState(() => new PolicyCore());
  const [state, setState] = useState(() => {
    initialResources.forEach((resource) => core.addResource(resource));
    return core.getState();
  });

  const updateState = useCallback(() => {
    setState(core.getState());
  }, [core]);

  const addResource = useCallback((resource: AWSResource) => {
    core.addResource(resource);
    updateState();
  }, [core, updateState]);

  const removeResource = useCallback((resourceId: string) => {
    core.removeResource(resourceId);
    updateState();
  }, [core, updateState]);

  const selectResource = useCallback((resourceId: string) => {
    const resource = state.resources.find((r) => r.id === resourceId);
    if (resource && !state.selections.some((s) => s.resourceId === resourceId)) {
      core.addResource(resource);
      updateState();
    }
  }, [core, state.resources, state.selections, updateState]);

  const deselectResource = useCallback((resourceId: string) => {
    core.removeResource(resourceId);
    updateState();
  }, [core, updateState]);

  const setActions = useCallback((resourceId: string, actions: string[]) => {
    const resource = state.resources.find((r) => r.id === resourceId);
    if (resource) {
      // Set up dependency resolver for this service
      const deps = getStaticDependencies(resource.service);
      core.setDependencyResolver((actions: string[]) => resolveDependencies(actions, deps));
      
      // Set actions without resolving dependencies here (will be resolved in generatePolicy)
      core.setActions(resourceId, actions);
      updateState();
    }
  }, [core, state.resources, updateState]);

  const setARN = useCallback((resourceId: string, arn: string) => {
    core.setARN(resourceId, arn);
    updateState();
  }, [core, updateState]);

  const setARNList = useCallback((arns: ARNItem[]) => {
    core.setARNList(arns);
    updateState();
  }, [core, updateState]);

  const getFilteredARNs = useCallback((service: string, resourceType?: string) => core.getFilteredARNs(service, resourceType), [core]);

  const reset = useCallback(() => {
    core.reset();
    updateState();
  }, [core, updateState]);

  const policy = useMemo(() => core.generatePolicy(), [core, state]);

  const selectedResources = useMemo(
    () => state.selections.map((s) => s.resourceId),
    [state.selections],
  );

  return {
    resources: state.resources,
    selectedResources,
    selections: state.selections,
    arnList: state.arnList,
    policy,
    addResource,
    removeResource,
    selectResource,
    deselectResource,
    setActions,
    setARN,
    setARNList,
    getFilteredARNs,
    reset,
  };
}
