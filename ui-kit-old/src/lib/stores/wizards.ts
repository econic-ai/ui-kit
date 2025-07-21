import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { createPersistedStore } from './localStorage';

// Wizard Types
export type WizardStepState = 
    | 'not_started' 
    | 'in_progress' 
    | 'completed' 
    | 'error' 
    | ''
    // Data source states
    | 'disabled'
    | 'available'
    | 'queued'
    | 'syncing'
    | 'integrated'
    | 'failed';

export interface WizardStep {
    number: number;
    id: string;
    text: string;
    icon: string;
    state?: WizardStepState;  // Make state optional
    stateIcon?: string;       // Add stateIcon field for custom icons
    component: string;
    url: string;              // Make url required
    data?: any;
    substeps?: WizardStep[]; // Optional array of substeps
}

export interface Wizard {
    id: string;
    title: string;
    description: string;
    steps: WizardStep[];
    currentStep: number;
    canExit: boolean;
    exitRoute?: string;
    // Additional properties for configuration options
    category?: 'suggested' | 'other';
    enabled?: boolean;
    preselected?: boolean;
    wizardRoute?: string;
    icon?: string;
}

export type WizardTree = Record<string, Wizard>;

// Initial wizard configurations
const initialWizards: WizardTree = {
    'register': {
        id: 'register',
        title: 'Register',
        description: 'Create an account',
        canExit: true,
        exitRoute: '/login',
        currentStep: 1,
        wizardRoute: '/flow/register',
        icon: 'fa-thin fa-user-plus',
        steps: [
            {
                number: 1,
                id: 'details',
                text: 'Tell us who you are',
                icon: 'fa-thin fa-user',
                state: 'not_started',
                component: 'Step1',
                url: '/flow/register/step1'
            },
            {
                number: 2,
                id: 'questionnaire',
                text: 'Some questions',
                icon: 'fa-thin fa-question',
                state: 'not_started',
                component: 'Step2',
                url: '/flow/register/step2'
            },
            {
                number: 3,
                id: 'welcome',
                text: 'Welcome',
                icon: 'fa-thin fa-house',
                state: 'not_started',
                component: 'Step3',
                url: '/flow/register/step3'
            }
        ]
    },
    'onboarding': {
        id: 'onboarding',
        title: 'Welcome to Econic',
        description: 'Complete your account setup',
        canExit: false,
        currentStep: 1,
        wizardRoute: '/flow/onboarding',
        icon: 'fa-thin fa-user-plus',
        steps: [
            {
                number: 1,
                id: 'welcome',
                text: 'Welcome',
                icon: 'fa-thin fa-house',
                state: 'not_started',
                component: 'Step1',
                url: '/flow/onboarding/step1'
            },
            {
                number: 2,
                id: 'terms',
                text: 'Terms & Conditions',
                icon: 'fa-thin fa-file-lines',
                state: 'not_started',
                component: 'Step2',
                url: '/flow/onboarding/step2'
            },
            {
                number: 3,
                id: 'plan',
                text: 'Choose a plan',
                icon: 'fa-thin fa-coins',
                state: 'not_started',
                component: 'Step3',
                url: '/flow/onboarding/step3'
            },
            {
                number: 4,
                id: 'details',
                text: 'Your Details',
                icon: 'fa-thin fa-user',
                state: 'not_started',
                component: 'Step4',
                url: '/flow/onboarding/step4',
                data: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    displayName: '',
                    phoneNumber: ''
                }
            },
            {
                number: 5,
                id: 'configure',
                text: 'Configure',
                icon: 'fa-thin fa-gear',
                state: 'not_started',
                component: 'Step5',
                url: '/flow/onboarding/step5',
                data: {
                    selectedOptions: []
                }
            }
        ]
    },
    'integrate': {
        id: 'integrate',
        title: 'Data Integrations',
        description: 'Connect your data sources',
        canExit: true,
        exitRoute: '/app/dashboard',
        wizardRoute: '/flow/integrate',
        currentStep: 1,
        enabled: true,
        preselected: true,
        category: 'suggested',
        icon: 'fa-regular fa-database',
        steps: [
            {
                number: 1,
                id: 'source',
                text: 'Select Sources',
                icon: 'fa-thin fa-1',
                state: 'not_started',
                stateIcon: 'fa-light fa-plug-circle-plus',
                component: 'IntegrateStep1',
                url: '/flow/integrate/select'
            },
            {
                number: 2,
                id: 'configure',
                text: 'Configure',
                icon: 'fa-thin fa-2',
                state: 'not_started',
                component: 'IntegrateStep2',
                url: '/flow/integrate/configure',
                substeps: []
            }
        ]
    },
    'graph-config': {
        id: 'graph-config',
        title: 'Configure Your Graph',
        description: 'Set up your knowledge graph structure, team connections, and collaboration settings',
        category: 'suggested',
        enabled: false,
        preselected: false,
        wizardRoute: '/flow/graph-config/step1',
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-diagram-project',
        steps: []
    },
    'virtual-assistants': {
        id: 'virtual-assistants',
        title: 'Virtual Assistants',
        description: 'Deploy AI assistants in your app or website with deep understanding of your enterprise knowledge',
        category: 'suggested',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-robot',
        steps: []
    },
    'customer-service': {
        id: 'customer-service',
        title: 'Customer Service Hub',
        description: 'Enable omni-channel AI support and proactive customer interactions',
        category: 'other',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-headset',
        steps: []
    },
    'knowledge-hub': {
        id: 'knowledge-hub',
        title: 'Knowledge Hub',
        description: 'Build a living library of organizational wisdom with natural language querying',
        category: 'other',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-books',
        steps: []
    },
    'collaboration-hub': {
        id: 'collaboration-hub',
        title: 'Collaboration Hub',
        description: 'Connect minds across departments and transform into a powerhouse of collective intelligence',
        category: 'other',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-people-group',
        steps: []
    },
    'intelligent-workflows': {
        id: 'intelligent-workflows',
        title: 'Intelligent Workflows',
        description: 'Automate processes and boost efficiency with AI-powered workflow automation',
        category: 'other',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-arrows-spin',
        steps: []
    },
    'data-intelligence': {
        id: 'data-intelligence',
        title: 'Data Intelligence',
        description: 'Gain deep insights from your enterprise data with advanced analytics and AI',
        category: 'other',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-chart-network',
        steps: []
    },
    'ai-search': {
        id: 'ai-search',
        title: 'AI Search',
        description: 'Implement powerful, context-aware search across your enterprise knowledge base',
        category: 'other',
        enabled: false,
        preselected: false,
        canExit: true,
        currentStep: 1,
        icon: 'fa-regular fa-magnifying-glass-chart',
        steps: []
    }
};

// Map of states to FontAwesome icons
const stateIconMap: Record<string, string> = { 
    // Wizard states
    'not_started': '',
    'in_progress': 'fa-solid fa-spinner fa-spin',
    'completed': 'fa-solid fa-circle-check',
    'error': 'fa-solid fa-circle-exclamation',
    
    // Data source states
    'disabled': '',
    'available': 'fa-light fa-plug-circle-plus',
    'queued': 'fa-solid fa-plug-circle-plus',
    'syncing': 'fa-light fa-arrows-rotate fa-spin',
    'integrated': 'fa-light fa-check-circle',
    'failed': 'fa-light fa-circle-xmark',
};

/**
 * Converts a state string to a FontAwesome icon class
 * @param state The state to convert
 * @returns FontAwesome icon class string
 */
export function getStateIcon(state: string): string {
    return stateIconMap[state] || '';
}

// Create wizard store
function createWizardStore() {
    // DO NOT DELETE THIS LINE 
    // const { subscribe, set, update } = createPersistedStore<WizardTree>('wizardTree', initialWizards);
    const { subscribe, set, update } = writable<WizardTree>(initialWizards);
    return {
        subscribe,
        set,
        update,

        // Get a specific wizard
        getWizard: (wizardId: string): Wizard | undefined => {
            const state = get({ subscribe });
            return state[wizardId];
        },

        // Get all wizards
        getAll: (): WizardTree => {
            return get({ subscribe });
        },

        // Get a specific step from a wizard
        getStep: (wizardId: string, stepNumber: number): WizardStep | undefined => {
            const wizard = get({ subscribe })[wizardId];
            return wizard?.steps.find(step => step.number === stepNumber);
        },

        // Update step state
        setStepState: (wizardId: string, stepNumber: number, state: WizardStepState) => {
            console.debug('Setting step state for wizardId:', wizardId, 'stepNumber:', stepNumber, 'state:', state);
            update(wizards => {
                const wizard = wizards[wizardId];
                if (!wizard) return wizards;

                // Get the icon for this state
                const stateIcon = getStateIcon(state);

                // Check if it's a main step or a substep
                const isSubstep = stepNumber % 1 !== 0;
                const mainStepNumber = Math.floor(stepNumber);

                if (isSubstep) {
                    console.log('It\'s a substep, finding the main step and updating the substep');
                    // It's a substep, find the main step and update the substep
                    const updatedSteps = wizard.steps.map(step => {
                        if (step.number === mainStepNumber && step.substeps) {
                            // Find and update the substep
                            const updatedSubsteps = step.substeps.map(substep => 
                                substep.number === stepNumber 
                                    ? { ...substep, state, stateIcon } 
                                    : substep
                            );
                            return { ...step, substeps: updatedSubsteps };
                        }
                        return step;
                    });

                    return {
                        ...wizards,
                        [wizardId]: {
                            ...wizard,
                            steps: updatedSteps
                        }
                    };
                } else {
                    // It's a main step, update it directly
                    const updatedSteps = wizard.steps.map(step =>
                        step.number === stepNumber 
                            ? { ...step, state, stateIcon } 
                            : step
                    );

                    return {
                        ...wizards,
                        [wizardId]: {
                            ...wizard,
                            steps: updatedSteps
                        }
                    };
                }
            });
        },

        // Update step data
        setStepData: (wizardId: string, stepNumber: number, data: any) => {
            // console.log('Setting step data for wizardId:', wizardId, 'stepNumber:', stepNumber, 'data:', data);
            update(wizards => {
                const wizard = wizards[wizardId];
                if (!wizard) return wizards;

                // Check if it's a main step or a substep
                const isSubstep = stepNumber % 1 !== 0;
                const mainStepNumber = Math.floor(stepNumber);

                if (isSubstep) {
                    // It's a substep, find the main step and update the substep
                    const updatedSteps = wizard.steps.map(step => {
                        if (step.number === mainStepNumber && step.substeps) {
                            // Find and update the substep
                            const updatedSubsteps = step.substeps.map(substep => 
                                substep.number === stepNumber ? { ...substep, data } : substep
                            );
                            return { ...step, substeps: updatedSubsteps };
                        }
                        return step;
                    });

                    return {
                        ...wizards,
                        [wizardId]: {
                            ...wizard,
                            steps: updatedSteps
                        }
                    };
                } else {
                    // It's a main step, update it directly
                    const updatedSteps = wizard.steps.map(step =>
                        step.number === stepNumber ? { ...step, data } : step
                    );

                    return {
                        ...wizards,
                        [wizardId]: {
                            ...wizard,
                            steps: updatedSteps
                        }
                    };
                }
            });
        },

        // Set current step
        setCurrentStep: (wizardId: string, stepNumber: number) => {
            update(wizards => {
                const wizard = wizards[wizardId];
                if (!wizard) return wizards;

                return {
                    ...wizards,
                    [wizardId]: {
                        ...wizard,
                        currentStep: stepNumber
                    }
                };
            });
        },

        // Reset a wizard to initial state
        resetWizard: (wizardId: string) => {
            update(wizards => ({
                ...wizards,
                [wizardId]: initialWizards[wizardId]
            }));
        },

        // Clear all wizard data
        clear: () => {
            set(initialWizards);
        }
    };
}

export const wizardStore = createWizardStore(); 