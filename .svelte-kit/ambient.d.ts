
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const PRERENDER: string;
	export const AUTH0_CLIENT_SECRET: string;
	export const AUTH0_SECRET: string;
	export const AUTH0_SCOPE: string;
	export const NVM_INC: string;
	export const npm_package_exports___styles___sass: string;
	export const MANPATH: string;
	export const npm_package_devDependencies_prettier: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const npm_config__fortawesome_registry: string;
	export const NVM_CD_FLAGS: string;
	export const INIT_CWD: string;
	export const npm_package_homepage: string;
	export const npm_package_devDependencies_typescript: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies_vite: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_package_dependencies_json5: string;
	export const npm_package_scripts_lint: string;
	export const npm_package_peerDependencies__sveltejs_kit: string;
	export const TERM_PROGRAM_VERSION: string;
	export const ANDROID_SDK_ROOT: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_dependencies__fontsource_inter: string;
	export const npm_package_exports___components_svelte: string;
	export const npm_package_scripts_prepublishOnly: string;
	export const npm_package_dependencies_jose: string;
	export const npm_package_exports___state_default: string;
	export const TERM_SESSION_ID: string;
	export const npm_package_exports___search_default: string;
	export const npm_package_sideEffects: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_exports___svelte: string;
	export const npm_package_exports___actions_default: string;
	export const npm_config_registry: string;
	export const ZSH: string;
	export const PNPM_HOME: string;
	export const npm_package_repository_url: string;
	export const npm_package_exports___markdown_preprocess_default: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const npm_package_description: string;
	export const LS_COLORS: string;
	export const npm_package_license: string;
	export const npm_package_dependencies__sveltejs_adapter_auto: string;
	export const npm_package_dependencies_esm_env: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_exports___auth_default: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const npm_package_devDependencies_flexsearch: string;
	export const npm_package_devDependencies_svelte: string;
	export const LSCOLORS: string;
	export const npm_config_frozen_lockfile: string;
	export const PATH: string;
	export const LaunchInstanceID: string;
	export const npm_package_exports___stores_default: string;
	export const npm_package_exports___styles___css: string;
	export const __CFBundleIdentifier: string;
	export const npm_package_author: string;
	export const PWD: string;
	export const npm_command: string;
	export const JAVA_HOME: string;
	export const npm_package_bugs_url: string;
	export const npm_package_devDependencies__sveltejs_package: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_repository_type: string;
	export const npm_package_devDependencies_marked: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_types: string;
	export const npm_package_exports___nav_svelte: string;
	export const npm_package_svelte: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const npm_package_exports___types: string;
	export const npm_package_exports___markdown_default: string;
	export const XPC_FLAGS: string;
	export const npm_package_exports___nav_default: string;
	export const npm_package_scripts_package_watch: string;
	export const npm_package_exports___server_content_default: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_dependencies__shikijs_twoslash: string;
	export const npm_package_devDependencies_magic_string: string;
	export const npm_package_exports___branding___svg: string;
	export const npm_package_exports___search_svelte: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_type: string;
	export const npm_package_exports___components_default: string;
	export const npm_package_exports___polyfills_default: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_package_publishConfig_access: string;
	export const LOGNAME: string;
	export const LESS: string;
	export const npm_package_scripts_format: string;
	export const npm_package_peerDependencies_svelte: string;
	export const npm_package_exports___docs_svelte: string;
	export const npm_lifecycle_script: string;
	export const npm_package_scripts_package: string;
	export const npm_package_exports___server_content_svelte: string;
	export const NVM_BIN: string;
	export const npm_package_dependencies_sass: string;
	export const npm_package_exports___docs_default: string;
	export const npm_config_user_agent: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const npm_package_devDependencies__types_node: string;
	export const npm_package_files_2: string;
	export const npm_package_exports___icons___svg: string;
	export const npm_package_files_1: string;
	export const npm_package_files_0: string;
	export const SECURITYSESSIONID: string;
	export const npm_package_dependencies_shiki: string;
	export const npm_package_scripts_check: string;
	export const npm_package_exports___styles___scss: string;
	export const npm_package_exports___assistant_default: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_DOMAIN: string;
	export const PUBLIC_APP_DOMAIN: string;
	export const PUBLIC_API_DOMAIN: string;
	export const PUBLIC_COMMON_DOMAIN: string;
	export const PUBLIC_AUTH0_DOMAIN: string;
	export const PUBLIC_AUTH0_CLIENT_ID: string;
	export const PUBLIC_AUTH0_LOGOUT_URL: string;
	export const PUBLIC_AUTH0_CALLBACK_URL: string;
	export const PUBLIC_UI_MOUNT_POINT: string;
	export const PUBLIC_WEB_MOUNT_POINT: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		PRERENDER: string;
		AUTH0_CLIENT_SECRET: string;
		AUTH0_SECRET: string;
		AUTH0_SCOPE: string;
		NVM_INC: string;
		npm_package_exports___styles___sass: string;
		MANPATH: string;
		npm_package_devDependencies_prettier: string;
		TERM_PROGRAM: string;
		NODE: string;
		npm_config__fortawesome_registry: string;
		NVM_CD_FLAGS: string;
		INIT_CWD: string;
		npm_package_homepage: string;
		npm_package_devDependencies_typescript: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies_vite: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		npm_package_dependencies_json5: string;
		npm_package_scripts_lint: string;
		npm_package_peerDependencies__sveltejs_kit: string;
		TERM_PROGRAM_VERSION: string;
		ANDROID_SDK_ROOT: string;
		npm_package_scripts_dev: string;
		npm_package_dependencies__fontsource_inter: string;
		npm_package_exports___components_svelte: string;
		npm_package_scripts_prepublishOnly: string;
		npm_package_dependencies_jose: string;
		npm_package_exports___state_default: string;
		TERM_SESSION_ID: string;
		npm_package_exports___search_default: string;
		npm_package_sideEffects: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_exports___svelte: string;
		npm_package_exports___actions_default: string;
		npm_config_registry: string;
		ZSH: string;
		PNPM_HOME: string;
		npm_package_repository_url: string;
		npm_package_exports___markdown_preprocess_default: string;
		USER: string;
		NVM_DIR: string;
		npm_package_description: string;
		LS_COLORS: string;
		npm_package_license: string;
		npm_package_dependencies__sveltejs_adapter_auto: string;
		npm_package_dependencies_esm_env: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_exports___auth_default: string;
		npm_execpath: string;
		PAGER: string;
		npm_package_devDependencies_flexsearch: string;
		npm_package_devDependencies_svelte: string;
		LSCOLORS: string;
		npm_config_frozen_lockfile: string;
		PATH: string;
		LaunchInstanceID: string;
		npm_package_exports___stores_default: string;
		npm_package_exports___styles___css: string;
		__CFBundleIdentifier: string;
		npm_package_author: string;
		PWD: string;
		npm_command: string;
		JAVA_HOME: string;
		npm_package_bugs_url: string;
		npm_package_devDependencies__sveltejs_package: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		npm_package_repository_type: string;
		npm_package_devDependencies_marked: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_types: string;
		npm_package_exports___nav_svelte: string;
		npm_package_svelte: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		npm_package_exports___types: string;
		npm_package_exports___markdown_default: string;
		XPC_FLAGS: string;
		npm_package_exports___nav_default: string;
		npm_package_scripts_package_watch: string;
		npm_package_exports___server_content_default: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_dependencies__shikijs_twoslash: string;
		npm_package_devDependencies_magic_string: string;
		npm_package_exports___branding___svg: string;
		npm_package_exports___search_svelte: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_svelte_check: string;
		SHLVL: string;
		HOME: string;
		npm_package_type: string;
		npm_package_exports___components_default: string;
		npm_package_exports___polyfills_default: string;
		HOMEBREW_PREFIX: string;
		npm_package_publishConfig_access: string;
		LOGNAME: string;
		LESS: string;
		npm_package_scripts_format: string;
		npm_package_peerDependencies_svelte: string;
		npm_package_exports___docs_svelte: string;
		npm_lifecycle_script: string;
		npm_package_scripts_package: string;
		npm_package_exports___server_content_svelte: string;
		NVM_BIN: string;
		npm_package_dependencies_sass: string;
		npm_package_exports___docs_default: string;
		npm_config_user_agent: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		npm_package_devDependencies__types_node: string;
		npm_package_files_2: string;
		npm_package_exports___icons___svg: string;
		npm_package_files_1: string;
		npm_package_files_0: string;
		SECURITYSESSIONID: string;
		npm_package_dependencies_shiki: string;
		npm_package_scripts_check: string;
		npm_package_exports___styles___scss: string;
		npm_package_exports___assistant_default: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_DOMAIN: string;
		PUBLIC_APP_DOMAIN: string;
		PUBLIC_API_DOMAIN: string;
		PUBLIC_COMMON_DOMAIN: string;
		PUBLIC_AUTH0_DOMAIN: string;
		PUBLIC_AUTH0_CLIENT_ID: string;
		PUBLIC_AUTH0_LOGOUT_URL: string;
		PUBLIC_AUTH0_CALLBACK_URL: string;
		PUBLIC_UI_MOUNT_POINT: string;
		PUBLIC_WEB_MOUNT_POINT: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
