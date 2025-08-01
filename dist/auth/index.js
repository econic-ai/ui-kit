import { SignJWT, jwtVerify } from 'jose';
import { AUTH0_CLIENT_SECRET, AUTH0_SECRET, AUTH0_SCOPE } from '$env/static/private';
import { PUBLIC_DOMAIN_BASE_URL, PUBLIC_AUTH0_CLIENT_ID, PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_LOGOUT_URL, PUBLIC_AUTH0_CALLBACK_URL } from '$env/static/public';
/**
 * Generate a random string for PKCE code verifier
 */
function generateCodeVerifier() {
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
async function generateCodeChallenge(verifier) {
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
function generateState() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
/**
 * Generate Auth0 login URL with PKCE
 */
export async function generateLoginUrl(returnTo, connection) {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateState();
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        redirect_uri: PUBLIC_AUTH0_CALLBACK_URL,
        scope: AUTH0_SCOPE || 'openid profile email',
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
 * Exchange authorization code for tokens
 */
export async function handleCallback(code, state, codeVerifier) {
    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${PUBLIC_AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: PUBLIC_AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: PUBLIC_AUTH0_CALLBACK_URL,
            code_verifier: codeVerifier
        })
    });
    if (!tokenResponse.ok) {
        throw new Error('Token exchange failed');
    }
    const tokens = await tokenResponse.json();
    // Get user info
    const userResponse = await fetch(`https://${PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
        },
    });
    if (!userResponse.ok) {
        throw new Error('User info fetch failed');
    }
    const user = await userResponse.json();
    return { user, tokens };
}
/**
 * Create a signed session JWT
 */
export async function createSessionToken(user, tokens) {
    const secret = new TextEncoder().encode(AUTH0_SECRET);
    const payload = {
        sub: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
        email_verified: user.email_verified,
        tokens: {
            access_token: tokens.access_token,
            id_token: tokens.id_token,
            refresh_token: tokens.refresh_token,
            expires_at: Date.now() + (tokens.expires_in * 1000)
        }
    };
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
    return jwt;
}
/**
 * Verify and decode session JWT
 */
export async function verifySessionToken(token) {
    const secret = new TextEncoder().encode(AUTH0_SECRET);
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    }
    catch (error) {
        throw new Error('Invalid session token');
    }
}
/**
 * Generate Auth0 logout URL
 */
export function generateLogoutUrl(returnTo) {
    const params = new URLSearchParams({
        client_id: PUBLIC_AUTH0_CLIENT_ID,
        returnTo: returnTo || `${PUBLIC_DOMAIN_BASE_URL}${PUBLIC_AUTH0_LOGOUT_URL}`
    });
    return `https://${PUBLIC_AUTH0_DOMAIN}/v2/logout?${params.toString()}`;
}
