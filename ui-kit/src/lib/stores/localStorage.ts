import { writable } from "svelte/store";
import { browser } from "$app/environment";

// Create a custom store that syncs with localStorage
export function createPersistedStore<T>(key: string, initialValue: T) {
    // Check for existing value in localStorage first
    let storedValue = initialValue;
    if (browser) {
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                storedValue = JSON.parse(stored);
            } catch (error) {
                console.warn(`Failed to parse stored value for ${key}:`, error);
            }
        }
    }

    const store = writable<T>(storedValue);
    let previousValue = storedValue;
    
    if (browser) {
        store.subscribe(value => {
            // Only save if the value has actually changed
            if (JSON.stringify(value) !== JSON.stringify(previousValue)) {
                previousValue = value;
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (error) {
                    console.warn(`Failed to save ${key} to localStorage:`, error);
                }
            }
        });
    }
    
    return store;
} 