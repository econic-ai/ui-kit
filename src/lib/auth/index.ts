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
export async function generateLoginUrl(
    returnTo?: string, 
    connection?: string,
    callbackUrl?: string
): Promise<{ url: string; state: string; codeVerifier: string }> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();
    
    // Default callback URL - API handles callback on same domain
    // This will be resolved at runtime when used from SSR
    const redirectUri = callbackUrl || '/api/auth/callback';
    
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        redirect_uri: redirectUri,
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
 * 
 * @param returnTo - Optional URL to redirect to after logout
 */
export function generateLogoutUrl(returnTo?: string): string {
    // Default return URL - back to app logout page
    const logoutReturnUrl = returnTo || '/logout';
    
    const params = new URLSearchParams({
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        returnTo: logoutReturnUrl
    });
    
    return `https://${PUBLIC_AUTH0_DOMAIN}/v2/logout?${params.toString()}`;
}

// ============================================================================
// DEPRECATED FUNCTIONS - Kept for backwards compatibility during migration
// These will be removed in a future version
// ============================================================================

/**
 * @deprecated API now handles callback - use API endpoint /api/auth/callback
 */
export async function handleCallback(
    _code: string, 
    _state: string, 
    _codeVerifier: string
): Promise<{ user: any; tokens: any }> {
    throw new Error(
        'handleCallback is deprecated. ' +
        'Auth0 callback is now handled by the API at /api/auth/callback. ' +
        'Configure AUTH0_CALLBACK_URL to point to the API.'
    );
}

/**
 * @deprecated API now handles token refresh - use SSR endpoint /api/auth/refresh
 */
export async function refreshAuth0Token(_refreshToken: string): Promise<any> {
    throw new Error(
        'refreshAuth0Token is deprecated. ' +
        'Token refresh is now handled by the API. ' +
        'Use the SSR /api/auth/refresh endpoint which proxies to the API.'
    );
}

/**
 * @deprecated Use API-signed session tokens instead
 */
export async function createSessionToken(_user: any, _tokens: any): Promise<string> {
    throw new Error(
        'createSessionToken is deprecated. ' +
        'Session tokens are now created and signed by the API.'
    );
}

/**
 * @deprecated Use verifySessionToken from $lib/server/session-crypto instead
 */
export async function verifySessionToken(_token: string): Promise<any> {
    throw new Error(
        'verifySessionToken from ui-kit is deprecated. ' +
        'Use verifySessionToken from $lib/server/session-crypto instead.'
    );
}
