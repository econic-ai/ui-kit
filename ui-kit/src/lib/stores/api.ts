import { authStore } from './auth';
import { get as getStore } from 'svelte/store';
import { PUBLIC_API_DOMAIN } from '$env/static/public';
import type { ApiError, ApiOptions, OnboardingRequest, OnboardingResponse } from '@econic/ui-kit/types';

const API_BASE = `https://${PUBLIC_API_DOMAIN}`;


// Auth API Functions
export const auth = {
    /**
     * Complete the user onboarding process and update auth token
     * @param data User onboarding information
     * @returns Response with new JWT token and user information
     * @throws ApiError if the request fails
     */
    async completeOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
        try {
            const response = await post<OnboardingResponse>('/auth/onboarding', data);
            
            // Update auth store with new token and user state
            authStore.update(state => ({
                ...state,
                accessToken: response.access_token,
                requiresOnboarding: false
            }));

            return response;
        } catch (error) {
            // Rethrow the error after logging
            console.error('Onboarding failed:', error);
            throw error;
        }
    }
    // Add other auth-related API calls here
};

/**
 * Registration API Functions
 */
export const registration = {
    /**
     * Submits registration form data to the API
     * @param data Registration form data from the wizard
     * @returns Promise with the API response
     */
    async submitRegistration(data: any): Promise<{success: boolean, message?: string, error?: string, id?: string}> {
        try {
            const response = await fetch('/api/submit-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit registration');
            }
            
            return result;
        } catch (error) {
            console.error('Error submitting registration form:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
};

// Helper Functions
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error: ApiError = {
            message: 'An error occurred',
            status: response.status
        };

        try {
            const data = await response.json();
            error.message = data.error || data.message || error.message;
        } catch {
            // If JSON parsing fails, use status text
            error.message = response.statusText;
        }

        throw error;
    }

    return response.json();
}

async function getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    const store = getStore(authStore);
    if (store.accessToken) {
        headers['Authorization'] = `Bearer ${store.accessToken}`;
    }

    return headers;
}

// Base API Functions
async function get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const headers = await getAuthHeaders();
    const queryString = options.params 
        ? '?' + new URLSearchParams(options.params).toString() 
        : '';

    const response = await fetch(`${API_BASE}${endpoint}${queryString}`, {
        method: 'GET',
        headers: {
            ...headers,
            ...options.headers
        }
    });

    return handleResponse<T>(response);
}

async function post<T>(endpoint: string, data: any, options: ApiOptions = {}): Promise<T> {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            ...headers,
            ...options.headers
        },
        body: JSON.stringify(data)
    });

    return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, data: any, options: ApiOptions = {}): Promise<T> {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: {
            ...headers,
            ...options.headers
        },
        body: JSON.stringify(data)
    });

    return handleResponse<T>(response);
}

export async function del<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers: {
            ...headers,
            ...options.headers
        }
    });

    return handleResponse<T>(response);
}

// Example usage:
// const data = await api.get<UserProfile>('/users/me');
// const result = await api.post<CreateUserResponse>('/users', { name: 'John' });
// const updated = await api.put<UserProfile>('/users/me', { name: 'Jane' });
// const deleted = await api.del<void>('/users/me');
