<script lang="ts">
	import { theme } from '../state';
	import { search } from '../state/search.svelte';
	
	let { user, visible = false, appMountPoint = '', webMountPoint = ''} = $props();

	function toggleTheme() {
		theme.current = theme.current === 'light' ? 'dark' : 'light';
	}

	function triggerSearch() {
		search.active = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		// Listen for Command+K (or Ctrl+K on Windows)
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			triggerSearch();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<div 
		class="app-nav-dropdown"
		role="menu"
		aria-label="App navigation menu"
	>
		<!-- Profile Section - picture, name and email -->
		<div class="profile-section">
		<div class="profile-avatar">
			{#if user?.picture}
				<img 
					src="{appMountPoint}/_/avatar" 
					alt="Profile" 
					class="profile-picture"
					onerror={(e) => { 
						const img = e.currentTarget as HTMLImageElement;
						img.style.display = 'none';
						const next = img.nextElementSibling as HTMLElement;
						if (next) next.style.display = 'flex';
					}}
				/>
				<i class="fa-solid fa-user fallback-icon" aria-hidden="true" style="display:none"></i>
			{:else}
				<i class="fa-solid fa-user" aria-hidden="true"></i>
			{/if}
		</div>
			<div class="profile-info">
				<div class="profile-name">{user?.name || 'Unknown User'}</div>
				<div class="profile-email">{user?.email || 'Unknown Email'}</div>
			</div>
		</div>

		<!-- Omni Search Section -->
		<div class="search-section">
			<button class="search-content" onclick={triggerSearch} aria-label="Open search">
				<span class="search-label">Omni Search</span>
				<div class="search-controls">
					<div class="search-shortcut">⌘ K</div>
					<div class="search-icon-btn">
						<i class="fa-solid fa-search" aria-hidden="true"></i>
					</div>
				</div>
			</button>
		</div>

		<!-- Divider -->
		<div class="divider"></div>

		<!-- Create Actions Section -->
		<div class="menu-section">
			<button class="menu-item" aria-label="Create Project">
				<span class="menu-item-text">Create Project</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-plus" aria-hidden="true"></i>
				</div>
			</button>
			
			<button class="menu-item" aria-label="Create Team">
				<span class="menu-item-text">Create Team</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-plus" aria-hidden="true"></i>
				</div>
			</button>
			
			<button class="menu-item" aria-label="Create Org / Network">
				<span class="menu-item-text">Create Org / Network</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-plus" aria-hidden="true"></i>
				</div>
			</button>
		</div>

		<!-- Divider -->
		<div class="divider"></div>

		<!-- Settings Section -->
		<div class="menu-section">
			<button class="menu-item" aria-label="Theme" onclick={toggleTheme}>
				<span class="menu-item-text">Theme</span>
				<div class="theme-toggle">
					<div class="toggle-switch" class:active={theme.current === 'dark'}>
						<div class="toggle-slider"></div>
					</div>
				</div>
			</button>

			<a href="{appMountPoint}/dashboard" class="menu-item" aria-label="Dashboard">
				<span class="menu-item-text">Dashboard</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-cog" aria-hidden="true"></i>
				</div>
			</a>			

			<a href="{appMountPoint}/admin" class="menu-item" aria-label="Admin">
				<span class="menu-item-text">Admin</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-cog" aria-hidden="true"></i>
				</div>
			</a>
			
		</div>
		<div class="divider"></div>
		<div class="menu-section">

			<a href="{webMountPoint}/" class="menu-item menu-link" aria-label="Home page">
				<span class="menu-item-text">Home page</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-home" aria-hidden="true"></i>
				</div>
			</a>
			
			<a href="{webMountPoint}/docs/technology" class="menu-item menu-link" aria-label="Documentation">
				<span class="menu-item-text">Documentation</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-book" aria-hidden="true"></i>
				</div>
			</a>
		</div>

		<!-- Divider -->
		<div class="divider"></div>

		<!-- Logout Section -->
		<div class="menu-section">
			<a href="{appMountPoint}/logout" class="menu-item menu-link logout-item" aria-label="Logout">
				<span class="menu-item-text">Logout</span>
				<div class="menu-item-icon">
					<i class="fa-solid fa-sign-out-alt" aria-hidden="true"></i>
				</div>
			</a>
		</div>
	</div>
{/if}

<style>
	.app-nav-dropdown {
		position: fixed;
		top: calc(var(--sk-nav-height) + 10px); /* Adjust to position dropdown correctly */
		right: 0; /* Account for nav avatar positioning */
		width: 300px;
		background-color: var(--sk-bg-0, #1a1a1a);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		z-index: 1001;
		border: 1px solid var(--sk-bg-4, #333);
		overflow: hidden;
		color: var(--sk-fg-1, #ffffff);
		margin-right: 1rem;
		padding-bottom: 0.2rem;
	}

	.profile-section {
		padding: 1.5rem 1.5rem 2rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;
	}

	.profile-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: var(--sk-bg-3);
		flex-shrink: 0;
		overflow: hidden;
		border: 2px solid var(--sk-bg-4);
	}

	.profile-picture {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-avatar i {
		font-size: 1.5rem;
		color: var(--sk-fg-3);
	}

	.profile-avatar .fallback-icon {
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	.profile-info {
		text-align: left;
		flex: 1;
	}

	.profile-name {
		font-size: 1.6rem;
		font-weight: 500;
		color: var(--sk-fg-1, #ffffff);
		margin-bottom: 0rem;
	}

	.profile-email {
		font-size: 1.5rem;
		color: var(--sk-fg-3, #888);
		text-decoration: underline;
	}

	.search-section {
		padding: 0.25rem 0.5rem; /* Same as menu-section */
	}

	.search-content {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1.5rem; /* Larger padding than menu-item (0.75rem 1rem) for bigger hover area */
		background: none;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.2s ease;
		text-align: left;
	}

	.search-content:hover {
		background-color: var(--sk-bg-2, #2a2a2a);
	}

	.search-label {
		font-size: 1.8rem; /* Larger text as requested */
		font-weight: 500;
		color: var(--sk-fg-1, #ffffff);
	}

	.search-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.search-shortcut {
		padding: 0.4rem 0.8rem;
		background-color: var(--sk-bg-3, #3a3a3a);
		border: 1px solid var(--sk-bg-4, #333);
		border-radius: 6px;
		font-size: 1.2rem;
		color: var(--sk-fg-2, #ccc);
		font-family: monospace;
	}

	.search-icon-btn {
		color: var(--sk-fg-2, #ccc);
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 1.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.divider {
		height: 1px;
		background-color: var(--sk-bg-4, #333);
		margin: 0.5rem 0; /* Full width - extends to edges */
	}

	.menu-section {
		padding: 0.25rem 0.5rem; /* Tighter spacing */
	}

	.menu-item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem; /* Reduced padding for tighter spacing */
		background: none;
		border: none;
		color: var(--sk-fg-1, #ffffff);
		cursor: pointer;
		border-radius: 8px;
		transition: background-color 0.2s ease;
		text-align: left;
		text-decoration: none; /* For when used as link */
	}

	.menu-item:hover {
		background-color: var(--sk-bg-2, #2a2a2a);
	}

	.menu-item-text {
		font-size: 1.4rem;
		font-weight: 400;
	}

	.menu-item-icon {
		width: 28px; /* Slightly smaller for tighter look */
		height: 28px;
		border-radius: 50%;
		background-color: var(--sk-bg-3, #3a3a3a);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		color: var(--sk-fg-2, #ccc);
		transition: background-color 0.2s ease;
	}

	.menu-item:hover .menu-item-icon {
		background-color: var(--sk-bg-4, #4a4a4a);
	}

	.theme-toggle {
		display: flex;
		align-items: center;
	}

	.toggle-switch {
		width: 48px;
		height: 24px;
		background-color: var(--sk-bg-2, #3a3a3a);
		border-radius: 12px;
		position: relative;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.toggle-switch:hover {
		background-color: var(--sk-bg-4, #4a4a4a);
	}

	.toggle-switch.active {
		background-color: var(--sk-bg-3, #0070f3);
	}

	.toggle-slider {
		width: 20px;
		height: 20px;
		background-color: var(--sk-fg-3, #666);
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px; /* Start from left */
		transition: transform 0.3s ease, background-color 0.3s ease;
	}

	.toggle-switch.active .toggle-slider {
		transform: translateX(24px); /* Move to right when active */
		background-color: white;
	}

	/* Dark mode specific adjustments */
	:root.dark .app-nav-dropdown {
		background-color: var(--sk-bg-0, #1a1a1a);
		border-color: var(--sk-bg-4, #333);
	}

	/* Light mode adjustments */
	:root:not(.dark) .app-nav-dropdown {
		background-color: #ffffff;
		border-color: #e0e0e0;
		color: #1a1a1a;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	:root:not(.dark) .profile-name {
		color: #1a1a1a;
	}

	:root:not(.dark) .search-content:hover {
		background-color: #f5f5f5;
	}

	:root:not(.dark) .search-label {
		color: #1a1a1a;
	}

	:root:not(.dark) .search-shortcut {
		background-color: #e0e0e0;
		border-color: #ccc;
		color: #666;
	}

	:root:not(.dark) .search-icon-btn {
		color: #666;
	}

	:root:not(.dark) .divider {
		background-color: #e0e0e0;
	}

	:root:not(.dark) .menu-item {
		color: #1a1a1a;
	}

	:root:not(.dark) .menu-item:hover {
		background-color: #f5f5f5;
	}

	:root:not(.dark) .menu-item-icon {
		background-color: #e0e0e0;
		color: #666;
	}

	:root:not(.dark) .menu-item:hover .menu-item-icon {
		background-color: #d0d0d0;
	}

	:root:not(.dark) .toggle-switch {
		background-color: #e0e0e0;
	}

	:root:not(.dark) .toggle-switch:hover {
		background-color: #d0d0d0;
	}

	:root:not(.dark) .toggle-switch.active {
		background-color: var(--sk-bg-3, #0070f3);
	}

	:root:not(.dark) .toggle-slider {
		background-color: #888;
	}

	/* Logout item styling */
	.logout-item {
		color: #e74c3c !important;
	}

	.logout-item:hover {
		background-color: rgba(231, 76, 60, 0.1) !important;
	}

	.logout-item .menu-item-icon {
		background-color: rgba(231, 76, 60, 0.1);
		color: #e74c3c;
	}

	.logout-item:hover .menu-item-icon {
		background-color: rgba(231, 76, 60, 0.2);
	}
</style> 