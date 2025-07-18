import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { createPersistedStore } from './localStorage';

// Non-persisted stores for dynamic UI measurements
export const fullWidth = writable(0);
export const fullHeight = writable(0);
export const splitWidth = writable(0);
export const splitHeight = writable(0);
export const isGraphExpanded = writable(false);

// Persisted stores
export type NavState = 'closed' | 'thin' | 'expanded';
export const sideNavState = createPersistedStore<NavState>('sideNavState', 'expanded');
export const lastAppRoute = createPersistedStore<string>('lastAppRoute', '/app/dashboard');

// Control Panel State - single consolidated store
export type GpuMode = 'webgpu' | 'webgl';

export interface ControlPanelState {
  masterControlsEnabled: boolean;
  gpuMode: GpuMode;
  is3D: boolean;
  orbitControls: boolean;
  gatherMetrics: boolean;
}

const defaultControlPanelState: ControlPanelState = {
  masterControlsEnabled: false,
  gpuMode: 'webgpu',
  is3D: true,
  orbitControls: true,
  gatherMetrics: true
};

// Create the consolidated control panel store
function createControlPanelStore() {
  const { subscribe, set, update } = createPersistedStore<ControlPanelState>('controlPanelState', defaultControlPanelState);
  
  return {
    subscribe,
    set,
    update,
    
    // Helper methods for updating individual properties
    setMasterControlsEnabled: (enabled: boolean) => {
      update(state => ({ ...state, masterControlsEnabled: enabled }));
    },
    
    setGpuMode: (mode: GpuMode) => {
      update(state => ({ ...state, gpuMode: mode }));
    },
    
    setIs3D: (is3D: boolean) => {
      update(state => ({ ...state, is3D }));
    },
    
    setOrbitControls: (enabled: boolean) => {
      update(state => ({ ...state, orbitControls: enabled }));
    },
    
    setGatherMetrics: (enabled: boolean) => {
      update(state => ({ ...state, gatherMetrics: enabled }));
    }
  };
}

export const controlPanelStore = createControlPanelStore();

// Individual reactive stores derived from the main store for convenience
export const masterControlsEnabled = {
  subscribe: (callback: (value: boolean) => void) => {
    return controlPanelStore.subscribe(state => callback(state.masterControlsEnabled));
  },
  set: (value: boolean) => controlPanelStore.setMasterControlsEnabled(value)
};

export const gpuMode = {
  subscribe: (callback: (value: GpuMode) => void) => {
    return controlPanelStore.subscribe(state => callback(state.gpuMode));
  },
  set: (value: GpuMode) => controlPanelStore.setGpuMode(value)
};

export const is3D = {
  subscribe: (callback: (value: boolean) => void) => {
    return controlPanelStore.subscribe(state => callback(state.is3D));
  },
  set: (value: boolean) => controlPanelStore.setIs3D(value)
};

export const orbitControls = {
  subscribe: (callback: (value: boolean) => void) => {
    return controlPanelStore.subscribe(state => callback(state.orbitControls));
  },
  set: (value: boolean) => controlPanelStore.setOrbitControls(value)
};

export const gatherMetrics = {
  subscribe: (callback: (value: boolean) => void) => {
    return controlPanelStore.subscribe(state => callback(state.gatherMetrics));
  },
  set: (value: boolean) => controlPanelStore.setGatherMetrics(value)
};

// TODO Delete later
export const heightOffset = 50;
export const widthOffset = 0;