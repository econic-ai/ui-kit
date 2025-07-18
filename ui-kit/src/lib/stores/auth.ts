import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, type User } from "firebase/auth";
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { app } from '../../../../../econic.ai/src/lib/firebase/client';
import { goto } from '$app/navigation';
import { PUBLIC_API_DOMAIN } from '$env/static/public';

// Create auth store
interface AuthState {
    user: User | null;
    authInProgress: boolean;
    loading: boolean;
    initialized: boolean;
    requiresOnboarding: boolean;
    accessToken?: string;
}

// Get initial state from localStorage if available
const getInitialState = (): AuthState => {

    let state: AuthState = {
        user: null,
        authInProgress: false,
        loading: false,
        initialized: false,
        requiresOnboarding: false
    };

    if (browser) {
        const savedToken = localStorage.getItem('accessToken');
        const savedOnboarding = localStorage.getItem('requiresOnboarding');
        // const auth_in_progress = false; // defaul to false here, so we clean out the old cookie
        const auth_in_progress = document.cookie.includes('auth_in_progress=1');
        state = {
            user: null,
            authInProgress: auth_in_progress,
            loading: false,
            initialized: false,
            accessToken: savedToken || undefined,
            requiresOnboarding: savedOnboarding ? JSON.parse(savedOnboarding) : false
        };
    }
    // console.debug('Intial state', state);
    return state;
};

const createAuthStore = () => {
    const { subscribe, set, update } = writable<AuthState>(getInitialState());
    // Subscribe to store changes to persist token
    if (browser) {
        subscribe(state => {
            // console.debug('Auth state changed', state);
            if (state.accessToken) {
                localStorage.setItem('accessToken', state.accessToken);
            } else {
                localStorage.removeItem('accessToken');
            }
            if (state.requiresOnboarding !== undefined) {
                localStorage.setItem('requiresOnboarding', JSON.stringify(state.requiresOnboarding));
            } else {
                localStorage.removeItem('requiresOnboarding');
            }
            if (!!state.authInProgress) {
                document.cookie = 'auth_in_progress=1; path=/';
            } else {
                document.cookie = 'auth_in_progress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
        });
    }

    return {
        subscribe,
        set,
        update,
        signInWithGoogle: async () => {
            // Record that we are in the process of authenticating
            update(state => ({ ...state, loading: true, authInProgress: true }));            
            
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
        
            try {
                await signInWithRedirect(auth, provider);
            } catch (error) {
                // Clear the auth in progress                
                update(state => ({ ...state, loading: false, authInProgress: false }));
                failedAuth(error);
            }
        },
        handleRedirect: async () => {
            if (!browser) return;
    
            // We are now in "loading mode"
            update(state => ({ ...state, loading: true }));;

            const auth = getAuth(app);

            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    // We got the auth results but we're still loading
                    update(state => ({ ...state, authInProgress: false, loading: true }));
                    
                    const idToken = await result.user.getIdToken();

                    // Perform both token operations in parallel
                    const [sessionResponse, tokenResponse] = await Promise.all([
                        // Create session cookie
                        fetch('/api/auth/session', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ idToken })
                        }),
                        // Get API access token
                        fetch(`https://${PUBLIC_API_DOMAIN}/auth/token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ idToken })
                        })
                    ]);
                    
                    if (!sessionResponse.ok) throw new Error('Failed to create session');
                    if (!tokenResponse.ok) throw new Error('Failed to get access token');

                    const tokenData = await tokenResponse.json();
                    console.log('Token operations completed');
                    
                    // Update auth store with token and onboarding status
                    update(state => ({ 
                        ...state, 
                        loading: false,
                        authInProgress: false,
                        initialized: !!tokenData.access_token,
                        accessToken: tokenData.access_token,
                        requiresOnboarding: tokenData.requires_onboarding
                    }));

                    console.log('Authentication flow complete.');
                        
                } else {
                    console.log('No result from getRedirectResult');
                    update(state => ({
                        ...state,
                        loading: false,
                        authInProgress: false,
                        initialized: false,
                        requiresOnboarding: false,
                    }));
                }
            } catch (e: any) {
                // Clear any partial auth state on failure
                console.error('Authentication flow failed.');                
                update(state => ({
                    ...state,
                    loading: false,
                    authInProgress: false,
                    initialized: false,
                    requiresOnboarding: false,
                    accessToken: undefined,

                }));
                failedAuth(e);
            }
        },
        signOut: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                // Sign out of Firebase first
                const auth = getAuth(app);
                await auth.signOut();
                
                // Redirect immediately
                await goto('/');

                // Clear session cookie and wait for it to complete
                const response = await fetch('/api/auth/session', { method: 'DELETE' });
                if (!response.ok) {
                    console.error('Failed to clear session');
                }
                
                // Clear all auth-related storage
                if (browser) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('requiresOnboarding');
                }
                
                // Clear store state
                update(state => ({ 
                    ...state, 
                    accessToken: undefined,                    
                    user: null,
                    loading: false,
                    authInProgress: false,
                    initialized: false,
                    requiresOnboarding: false,                    
                }));    


            } finally {
                update(state => ({ ...state, loading: false, authInProgress: false, initialized: false, requiresOnboarding: false }));
            }
        }
    };
};

const failedAuth = (e: any) => {
    console.error('Failed to authenticate with', e);
    goto('/login-failed', { replaceState: true });
}

export const authStore = createAuthStore();

// Initialize auth state listener
if (browser) {
    const auth = getAuth(app);
    auth.onAuthStateChanged((user) => {
        authStore.update(state => {
            // If we have a user but no access token, trigger handleRedirect
            if (user && !state.accessToken) {
                console.log('Auth user found, but no access token. Triggering handleRedirect.');
                authStore.handleRedirect().catch(console.error);
            }

            const flag1 = !!user;
            const flag2 = !!state.accessToken;
            const flag3 = flag1 && flag2;

            return {
                ...state,
                user,
                loading: false,
                initialized: !!user && !!state.accessToken
            };
        });
    });    

}

