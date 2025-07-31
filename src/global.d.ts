/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface PageData {
			nav_title: string;
		}
	}
}

/// <reference types="@sveltejs/kit" />
declare module '$env/static/public' {
    export const PUBLIC_UI_MOUNT_POINT: string;
    export const PUBLIC_WEB_MOUNT_POINT: string;
    export const PUBLIC_DOMAIN: string;
    export const PUBLIC_DOMAIN_BASE_URL: string;
	export const PUBLIC_AUTH0_CALLBACK_URL: string;
	export const PUBLIC_AUTH0_LOGOUT_URL: string;
	export const PUBLIC_AUTH0_CLIENT_ID: string;
	export const PUBLIC_AUTH0_DOMAIN: string;
}

/// <reference types="@sveltejs/kit" />
declare module '$env/static/private' {
    export const AUTH0_CLIENT_SECRET: string;
    export const AUTH0_SECRET: string;
    export const AUTH0_SCOPE: string;
}
  