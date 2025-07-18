import { get } from 'svelte/store';
import { createPersistedStore } from './localStorage';

// Types for user data structure
export interface UserDetails {
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subscription {
    id: string;
    name: string;
    planId: string;
    status: 'active' | 'inactive' | 'pending' | 'cancelled';
    startDate: string;
    endDate?: string;
    features: string[];
}

export interface GraphNode {
    id: string;
    type: string;
    label: string;
    properties: Record<string, any>;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    properties: Record<string, any>;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface Configuration {
    graphs: Record<string, Graph>;
    settings: Record<string, any> | null;
}

export interface UserState {
    details: UserDetails | null;
    subscription: Subscription | null;
    configuration: Configuration | null;
}

// Initial state for the user store
const initialUserState: UserState = {
    details: null,
    subscription: null,
    configuration: {
        graphs: {},
        settings: null
    }
};

// Create the user store
function createUserStore() {
    const { subscribe, set, update } = createPersistedStore<UserState>('userState', initialUserState);

    return {
        subscribe,
        set,
        update,

        // Update user details
        setUserDetails: (details: UserDetails) => {
            update(state => ({
                ...state,
                details
            }));
        },

        // Update subscription
        setSubscription: (subscription: Subscription) => {
            update(state => ({
                ...state,
                subscription
            }));
        },

        // Update configuration
        setConfiguration: (configuration: Configuration) => {
            update(state => ({
                ...state,
                configuration
            }));
        },

        // Update a specific graph in configuration
        setGraph: (graphId: string, graph: Graph) => {
            update(state => ({
                ...state,
                configuration: {
                    ...state.configuration,
                    graphs: {
                        ...(state.configuration?.graphs || {}),
                        [graphId]: graph
                    },
                    settings: state.configuration?.settings || null
                }
            }));
        },

        // Clear all user data
        clear: () => {
            set(initialUserState);
        }
    };
}

export const userStore = createUserStore(); 