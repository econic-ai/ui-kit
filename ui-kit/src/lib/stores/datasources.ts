import { writable, get } from "svelte/store";
import { createPersistedStore } from "./localStorage";

// Define the possible status values for data sources
export type DataSourceStatus = 
    | "disabled"    // Source is not available for integration
    | "available"   // Source is available but not yet integrated
    | "queued"      // Integration is queued but not started
    | "syncing"     // Currently syncing data
    | "integrated"  // Successfully integrated
    | "error"       // Error during integration
    | "failed";     // Integration failed

// Define the data source interface
export interface DataSource {
    id: string;
    name: string;
    iconFile?: string;  // Path to SVG icon file (optional)
    icon?: string;      // FontAwesome icon class (optional)
    status: DataSourceStatus;
}

// Initial data sources
const initialDataSources: DataSource[] = [
    {
        id: "google-drive",
        name: "Google Drive",
        icon: "fa-brands fa-google-drive",
        status: "available"
    },
    {
        id: "slack",
        name: "Slack",
        icon: "fa-brands fa-slack",
        status: "available"
    },
    {
        id: "dropbox",
        name: "Dropbox",
        icon: "fa-brands fa-dropbox",
        status: "available"
    },
    {
        id: "gmail",
        name: "Gmail",
        icon: "fa-solid fa-envelope",
        status: "available"
    },
    {
        id: "github",
        name: "GitHub",
        icon: "fa-brands fa-github",
        status: "available"
    },
    {
        id: "rss",
        name: "RSS",
        icon: "fa-solid fa-rss",
        status: "disabled"
    },
    {
        id: "outlook",
        name: "Outlook",
        icon: "fa-solid fa-envelope",
        status: "disabled"
    },
    {
        id: "google-calendar",
        name: "Google Calendar",
        icon: "fa-solid fa-calendar",
        status: "syncing"
    },
    {
        id: "stock-prices",
        name: "Stock Prices",
        icon: "fa-solid fa-chart-line",
        status: "integrated"
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
        icon: "fa-brands fa-whatsapp",
        status: "disabled"
    },
    {
        id: "viber",
        name: "Viber",
        icon: "fa-brands fa-viber",
        status: "disabled"
    },
    {
        id: "messenger",
        name: "Messenger",
        icon: "fa-brands fa-facebook-messenger",
        status: "disabled"
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: "fa-brands fa-facebook",
        status: "disabled"
    },
    {
        id: "twitter",
        name: "X/Twitter",
        icon: "fa-brands fa-twitter",
        status: "disabled"
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: "fa-brands fa-youtube",
        status: "disabled"
    },
    {
        id: "onedrive",
        name: "OneDrive",
        icon: "fa-solid fa-cloud",
        status: "disabled"
    },
    {
        id: "apple-fit",
        name: "Apple Fit",
        icon: "fa-brands fa-apple",
        status: "disabled"
    },
    {
        id: "teams",
        name: "Teams",
        icon: "fa-solid fa-users",
        status: "disabled"
    },
    {
        id: "web-browsing",
        name: "Web Browsing",
        icon: "fa-solid fa-globe",
        status: "disabled"
    }
];

// Create the data sources store
function createDataSourcesStore() {
    const { subscribe, set, update } = createPersistedStore<DataSource[]>('datasources', initialDataSources);
    
    const store = {
        subscribe,
        
        // Get all data sources
        getAll: () => store,
        
        // Get a specific data source by ID
        getById: (id: string): DataSource | undefined => {
            const sources = get({ subscribe });
            return sources.find(source => source.id === id);
        },
        
        // Get data sources by status
        getByStatus: (status: DataSourceStatus): DataSource[] => {
            const sources = get({ subscribe });
            return sources.filter(source => source.status === status);
        },
        
        // Update a data source's status
        updateStatus: (id: string, status: DataSourceStatus) => {
            update(sources => 
                sources.map(source => 
                    source.id === id 
                        ? { ...source, status } 
                        : source
                )
            );
        },
        
        // Reset all data sources to their initial state
        reset: () => set(initialDataSources)
    };
    
    return store;
}

export const dataSourcesStore = createDataSourcesStore();
