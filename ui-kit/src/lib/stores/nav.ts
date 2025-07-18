import { writable, get } from 'svelte/store';
import { sideNavState } from './ui';
import { browser } from '$app/environment';

export interface NavItem {
    text: string;
    path: string;
    icon?: string;
    hint?: string;
    action?: () => void;
    hide?: boolean;
    children?: NavItem[];
}

export type NavTree = Record<string, NavItem>;

// User role type - defines possible user roles in the system
export type UserRole = 'admin' | 'developer' | 'user' | 'visitor';

// Function to create a user role store with localStorage persistence
function createUserRoleStore() {
    // Default role is 'visitor' if nothing is in localStorage
    const defaultRole: UserRole = 'visitor';
    
    // Get initial value from localStorage if available
    let initialValue: UserRole = defaultRole;
    
    if (browser) {
        const storedRole = localStorage.getItem('userRole') as UserRole;
        if (storedRole) {
            initialValue = storedRole;
        } else {
            // If no value in localStorage, write the default
            localStorage.setItem('userRole', defaultRole);
        }
    }
    
    const store = writable<UserRole>(initialValue);
    
    // Return a custom store with additional features
    return {
        subscribe: store.subscribe,
        set: (value: UserRole) => {
            store.set(value);
            if (browser) {
                localStorage.setItem('userRole', value);
            }
        },
        update: (updater: (value: UserRole) => UserRole) => {
            store.update(currentValue => {
                const newValue = updater(currentValue);
                if (browser) {
                    localStorage.setItem('userRole', newValue);
                }
                return newValue;
            });
        },
        // Helper method to check if user has sufficient privileges
        hasRole: (minimumRole: UserRole): boolean => {
            const currentRole = get(store);
            const roles: UserRole[] = ['visitor', 'user', 'developer', 'admin'];
            return roles.indexOf(currentRole) >= roles.indexOf(minimumRole);
        }
    };
}

// Export the user role store
export const userRole = createUserRoleStore();

// Function to add a new navigation item
function addNewNavItem() {
    const navStore = get(navTree);
    const adminPath = 'app/dev';
    const adminNav = navStore[adminPath];
    
    if (!adminNav) return;

    const newItemNumber = (adminNav.children || [])
        .filter(item => item.path.startsWith(`${adminPath}/nav-item-`))
        .length + 1;

    const newItemPath = `${adminPath}/nav-item-${newItemNumber}`;
    const newItem = {
        text: `New Nav ${newItemNumber}`,
        path: newItemPath,
        icon: 'fa fa-star',
        hint: `Dynamically added navigation item ${newItemNumber}`
    };

    navTree.update(tree => {
        if (!tree[adminPath].children) tree[adminPath].children = [];
        tree[adminPath].children.push(newItem);
        return tree;
    });
}

// Function to hide the side navigation
function hideSideNav() {
    sideNavState.set('closed');
}

// Initial navigation structure with flat URL mapping
const initialNav: NavTree = {
    'app': {
        text: 'Home',
        path: 'app',
        icon: 'fa fa-home',
        children: [
            {
                text: 'Chat',
                path: '#',
                icon: 'fa fa-comments'
            },
            {
                text: 'Graphs',
                path: '#',
                icon: 'fa fa-chart-network'
            },
            {
                text: 'Data',
                path: '#',
                icon: 'fa fa-database'
            }
        ]
    },
    'app/dashboard': {
        text: 'Dashboard',
        path: 'app/dashboard',
        icon: 'fa fa-gauge',
        hint: 'Application dashboard and metrics',
        hide: false,
        children: []
    },
    'app/admin': {
        text: 'Admin',
        path: 'app/admin',
        icon: 'fa fa-shield',
        children: []
    },
    'app/dev': {
        text: 'Dev Mode',
        path: 'app/dev',
        icon: 'fa fa-code',
        children: [
            {
                text: 'Onboarding flow',
                path: 'flow/onboarding',
                icon: 'fa fa-user-plus',
                hint: 'Configure and manage user onboarding flow'
            },
            {
                text: 'Integrations flow',
                path: 'flow/integrate',
                icon: 'fa fa-database',
                hint: 'Configure integrations for your AI'
            },            
            {
                text: 'Beta Tester Flow',
                path: 'flow/register',
                icon: 'fa fa-flask',
                hint: 'Register as a beta tester'
            },                        
            {
                text: 'Add Nav Item',
                path: '#',
                icon: 'fa fa-plus',
                hint: 'Add a new navigation item',
                action: addNewNavItem
            },
            {
                text: 'Hide Nav',
                path: '#',
                icon: 'fa fa-minus',
                hint: 'Hides the side navigation',
                action: hideSideNav
            }
        ]
    },    
    'flow': {
        hide: true,
        text: 'Onboarding',
        path: '/app/flow/onboarding',
        icon: 'fa fa-user-plus',
        hint: 'User onboarding flow',
        children: []
    }
};

export const navTree = writable<NavTree>(initialNav);

// Helper function to find the closest matching URL in the navigation tree
export function findClosestNavUrl(fullPath: string): string | null {
    // Remove leading slash and split into segments
    const pathSegments = fullPath.replace(/^\//, '').split('/');
    const navStore = get(navTree);
    
    // Start from the most specific path and work backwards
    for (let i = pathSegments.length; i > 0; i--) {
        const path = pathSegments.slice(0, i).join('/');
        if (navStore[path]) {
            return path;
        }
    }

    return null;
} 