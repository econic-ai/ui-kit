/**
 * Auth utilities for SSR (SvelteKit)
 * 
 * With the new architecture:
 * - SSR initiates login (generates Auth0 URL with PKCE)
 * - API handles callback (exchanges code for tokens, creates session)
 * - SSR only verifies session tokens using public key
 * 
 * AUTH0_CLIENT_SECRET and AUTH0_SECRET are no longer needed on SSR side.
 */

import { 
    AUTH0_SCOPE,
    AUTH0_AUDIENCE
} from '$env/static/private';
import { 
    PUBLIC_AUTH0_CLIENT_ID, 
    PUBLIC_AUTH0_DOMAIN,
    PUBLIC_AUTH0_LOGOUT_URL,
    PUBLIC_AUTH0_CALLBACK_URL
} from '$env/static/public';

/**
 * Generate a random string for PKCE code verifier
 */
function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate PKCE code challenge from verifier
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate random state parameter
 */
function generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate Auth0 login URL with PKCE
 * 
 * SSR calls this to initiate login, storing the codeVerifier in a cookie.
 * The API will use the codeVerifier when handling the callback.
 */
export async function generateLoginUrl(returnTo?: string, connection?: string): Promise<{ url: string; state: string; codeVerifier: string }> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();
    
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        redirect_uri: PUBLIC_AUTH0_CALLBACK_URL,
        scope: AUTH0_SCOPE || 'openid profile email offline_access',
        audience: AUTH0_AUDIENCE,  // Required to get JWT access token instead of opaque token
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: returnTo ? `${state}:${returnTo}` : state
    });

    // Force specific connection (e.g., 'google-oauth2' for Google)
    if (connection) {
        params.set('connection', connection);
    }
    
    const url = `https://${PUBLIC_AUTH0_DOMAIN}/authorize?${params.toString()}`;
    
    return { url, state, codeVerifier };
}

/**
 * Generate Auth0 logout URL
 */
export function generateLogoutUrl(returnTo?: string): string {
    const params = new URLSearchParams({
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        returnTo: returnTo || PUBLIC_AUTH0_LOGOUT_URL
    });
    
    return `https://${PUBLIC_AUTH0_DOMAIN}/v2/logout?${params.toString()}`;
} 