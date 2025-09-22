/**
 * Generate Auth0 login URL with PKCE
 */
export declare function generateLoginUrl(returnTo?: string, connection?: string): Promise<{
    url: string;
    state: string;
    codeVerifier: string;
}>;
/**
 * Exchange authorization code for tokens
 */
export declare function handleCallback(code: string, state: string, codeVerifier: string): Promise<{
    user: any;
    tokens: any;
}>;
/**
 * Create a signed session JWT
 */
export declare function createSessionToken(user: any, tokens: any): Promise<string>;
/**
 * Verify and decode session JWT
 */
export declare function verifySessionToken(token: string): Promise<any>;
/**
 * Generate Auth0 logout URL
 */
export declare function generateLogoutUrl(returnTo?: string): string;
