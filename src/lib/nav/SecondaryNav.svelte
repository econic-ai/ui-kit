<script lang="ts">
	import { Icon, ThemeToggle } from '../components';
	import { search } from '../state/search.svelte';
	import { theme } from '../state';
	import { page } from '$app/state';

	interface Props {
		user?: any;
		session?: { user?: any } | null;
	}

	let { user, session }: Props = $props();

	// Determine if user is logged in
	let isLoggedIn = $derived(page.url.pathname.includes('ui'));
    // let isLoggedIn = true

	function toggleTheme() {
		theme.current = theme.current === 'light' ? 'dark' : 'light';
	}

	$effect(() => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme.current);
	});
</script>

<div class="secondary-nav">
	<div class="secondary-nav-content">
		<!-- Social Links -->
		<a href="https://www.youtube.com/@econic-ai" class="icon-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
			<i class="fa-brands fa-youtube" aria-hidden="true"></i>
		</a>

		<a href="https://github.com/econic-ai" class="icon-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
			<i class="fa-brands fa-github" aria-hidden="true"></i>
		</a>

		<a href="https://discord.gg/YpKq92XWz2" class="icon-link" aria-label="Discord" target="_blank" rel="noopener noreferrer">
			<i class="fa-brands fa-discord" aria-hidden="true"></i>
		</a>

		<!-- Search -->
		<button
			class="icon-link search-button"
			aria-label="Search"
			onclick={() => {
				search.active = true;
			}}
		>
			<i class="fa-solid fa-search" aria-hidden="true"></i>
		</button>

		<!-- Auth Button -->
		{#if isLoggedIn}
			<a href="/ui/" class="auth-button __link" data-sveltekit-reload>
				<span>Main Website</span>
			</a>
			<!-- Avatar profile link for future authenticated nav -->
			<a href="/app/profile" class="avatar-link" aria-label="Profile">
				<div class="avatar">
					<!-- Future: Replace with actual user image -->
					<i class="fa-solid fa-user" aria-hidden="true"></i>
				</div>
			</a>
		{:else}
			<!-- Theme Toggle (only when not logged in) -->
			<button
				class="icon-link theme-toggle"
				aria-label="Toggle dark mode"
				aria-pressed={theme.current === 'dark'}
				onclick={toggleTheme}
			>
				<i class="fa-solid {theme.current === 'light' ? 'fa-moon' : 'fa-sun'}" aria-hidden="true"></i>
			</button>
			
			<a href="/register" class="auth-button __link">
				<span>Register</span>
			</a>
			
			<a href="/login" class="auth-button __link">
				<span>Sign in</span>
			</a>
			

		{/if}
	</div>
</div>

<style>
	.secondary-nav {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		padding: 0 1rem;
	}

	.secondary-nav-content {
		display: flex;
		align-items: center;
		gap: 0rem;
	}

	.icon-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 8px;
		color: var(--sk-fg-3);
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 18px;

		&:hover {
			color: var(--sk-fg-1);
			background-color: var(--sk-bg-3);
		}

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 2px solid var(--sk-fg-accent);
			outline-offset: 2px;
		}
	}

	.search-button {
		background: none;
		border: none;
		cursor: pointer;
	}

	.theme-toggle {
		margin-right: 0.8rem;
	}

	.auth-button {
		margin-left: 1rem;
		margin-right: 1rem;
		
		/* Override __link default styling for nav context */
		&.__link {
			/* Adjust sizing for navigation context */
			padding: 0.8rem 1.6rem !important;
			font-size: 1.4rem !important;
			
			/* Ensure proper spacing in nav */
			margin: 0 0.5rem;
			
			/* The __link class provides gradient border and hover effects */
			&::before {
				border-radius: 3px !important;
			}
		}


	}

	.avatar-link {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition: transform 0.2s ease;
		margin-left: 0.5rem;

		&:hover {
			transform: scale(1.05);
		}
	}

	.avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--sk-fg-3);
		color: var(--sk-fg-3);
		font-size: 16px;
		transition: all 0.2s ease;
		overflow: hidden;

		/* Future: For when we add actual images */
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style> 