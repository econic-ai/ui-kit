<script lang="ts">
	import { Icon, ThemeToggle, AppNavDropDown } from '../components';
	import { search } from '../state/search.svelte';
	import { theme } from '../state';
	import { page } from '$app/state';

	let { user = { name: 'Jordan Rancie', email: 'jordan@datakey.ai' }, session, appMountPoint = '', isLoggedIn = false } = $props();

	// Dropdown state
	let showDropdown = $state(false);
	let dropdownTimeout: NodeJS.Timeout | null = null;

	// Determine if user is logged in
	// let isLoggedIn = $derived(page.url.pathname.includes('ui'));
    // let isLoggedIn = true

	function toggleTheme() {
		theme.current = theme.current === 'light' ? 'dark' : 'light';
	}

	function handleMouseEnter() {
		if (dropdownTimeout) {
			clearTimeout(dropdownTimeout);
			dropdownTimeout = null;
		}
		showDropdown = true;
	}

	function handleMouseLeave() {
		dropdownTimeout = setTimeout(() => {
			showDropdown = false;
		}, 150); // Small delay to prevent flickering
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (!target.closest('.avatar-container')) {
			showDropdown = false;
		}
	}

	$effect(() => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme.current);
	});

	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}

		// Cleanup
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="secondary-nav">
	<div class="secondary-nav-content">
		<!-- Social Links -->
		<!-- <a href="https://www.youtube.com/@econic-ai" class="icon-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
			<i class="fa-brands fa-youtube" aria-hidden="true"></i>
		</a>

		<a href="https://github.com/econic-ai" class="icon-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
			<i class="fa-brands fa-github" aria-hidden="true"></i>
		</a>

		<a href="https://discord.gg/YpKq92XWz2" class="icon-link" aria-label="Discord" target="_blank" rel="noopener noreferrer">
			<i class="fa-brands fa-discord" aria-hidden="true"></i>
		</a> -->

		<!-- Search -->

		<!-- Auth Button -->
		{#if isLoggedIn}
			<!-- <a href="/" class="auth-button nav-button inverted" data-sveltekit-reload>
				<span>Documentation</span>
			</a>
			<button
				class="icon-link search-button"
				aria-label="Search"
				onclick={() => {
					search.active = true;
				}}
			>
				<i class="fa-solid fa-search" aria-hidden="true"></i>
			</button> -->

			<!-- Avatar profile link with dropdown -->
			<div 
				class="avatar-container"
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				role="menu"
				aria-label="App navigation menu"
				tabindex="0"
			>
				<button class="avatar-link" aria-label="Profile">
					<div class="avatar">
						<!-- Future: Replace with actual user image -->
						<i class="fa-solid fa-user" aria-hidden="true"></i>
					</div>
				</button>
				
				<AppNavDropDown visible={showDropdown} {user} />
			</div>
	
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

			<button
				class="icon-link search-button"
				aria-label="Search"
				onclick={() => {
					search.active = true;
				}}
			>
				<i class="fa-solid fa-search" aria-hidden="true"></i>
			</button>

			
			<a href="{appMountPoint}/dev" class="auth-button nav-button inverted">
				<span>Register | Sign in</span>
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
		height: 100%;
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
		/* margin-right: 0.8rem; */
	}

	/* .auth-button {
		margin-left: 1rem;
		margin-right: 1rem;
	} */

	/* Override __link default styling for nav context */
	.nav-button {
		/* Adjust sizing for navigation context */
		padding: 0.8rem 1.2rem !important;
		font-size: 1.4rem !important;
		color: var(--sk-fg-2);
		/* background-color: var(--sk-bg-1); */
		border-radius: 8px;
		border: none;
		/* margin: 0 1rem; */
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover {
			/* color: var(--sk-bg-2); */
			background-color: var(--sk-bg-3);
			transition: all 0.3s ease;
		}

/* 
		&.inverted {
			color: var(--sk-fg-2);
			background-color: var(--sk-bg-2);
		} */
		
	}	

	.avatar-container {
		position: relative;
		display: flex;
		align-items: center;
		margin-left: 0.5rem;
		/* Ensure dropdown can position relative to nav height */
		height: var(--sk-nav-height);
	}

	.avatar-link {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		transition: transform 0.2s ease;

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
		margin-left: 0.4rem;

		/* Future: For when we add actual images */
		/* img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		} */
	}
</style> 