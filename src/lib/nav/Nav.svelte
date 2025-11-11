<script lang="ts">
	import { overlay_open, on_this_page_open } from '../stores';
	import { search } from '../state/search.svelte';
	import { Icon } from '../components';
	import { page } from '$app/stores';
	import MobileMenu from './MobileMenu.svelte';
	import AppSecondaryNav from './AppSecondaryNav.svelte';
	import { tick } from 'svelte';
	
	let { home_title = '', title = '', links, user, appMountPoint = '', webMountPoint = '' } = $props();

	let visible = $state(true);

	let showMegaMenu = $state(false);

	// mobile nav stuff
	let open = $state(false);
	// @ts-ignore - esrap parser has issues with generic type annotations
	let current = $state.raw();
	// @ts-ignore - esrap parser has issues with HTMLButtonElement type annotations
	let menu_button: HTMLButtonElement;
	
	// Dropdown state management
	let openDropdown = $state<string | null>(null);
	
	// Backdrop state management (after open is declared)
	let backdropState = $derived.by(() => {
		if (open) return 'mobile-open';
		if (showMegaMenu) return 'mega-menu';
		return 'default';
	});

	// Prevents navbar to show/hide when clicking in docs sidebar
	let hash_changed = false;
	function handle_hashchange() {
		hash_changed = true;
	}

	let last_scroll = 0;
	function handle_scroll() {
		const scroll = window.scrollY;
		if (!hash_changed) {
			visible = scroll === last_scroll ? visible : scroll < 50 || scroll < last_scroll;
		}

		last_scroll = scroll;
		hash_changed = false;
	}

	$effect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
	});

	//+++++++++++++++++++++++++++++++++++++++++++++
	// Mega Menu Logic
	//+++++++++++++++++++++++++++++++++++++++++++++

	let hoveredMenu = $state.raw();

	// Function to check if current URL matches the link href
	// @ts-ignore - esrap parser has issues with function parameter type annotations
	function isCurrentPage(href) {
		return $page.url.pathname === href;
	}

	// @ts-ignore - esrap parser has issues with function parameter type annotations
	function isCurrentSection(slug) {
		return $page.url.pathname.startsWith('/' + slug);
	}

	// let custom_links = [{
	// 	title: 'All Services',
	// 	slug: 'custom-links',
	// },
	// {
	// 	title: 'Resources',
	// 	slug: 'assistant',
	// },
	// {
	// 	title: 'Company',
	// 	slug: 'assistant',
	// },
	// ]

	// custom_links = links;

</script>

<svelte:window
	onscroll={handle_scroll}
	onhashchange={handle_hashchange}
	onkeydown={(e) => {
		if (open && e.key === 'Escape') {
			open = false;
			// we only manage focus when Esc is hit
			// otherwise, the navigation will reset focus
			tick().then(() => menu_button?.focus());
		}
	}}
/>

<!-- Navigation backdrop element -->
<div 
	class="nav-backdrop"
	class:mobile-open={backdropState === 'mobile-open'}
	class:mega-menu-active={backdropState === 'mega-menu'}
	class:default={backdropState === 'default'}
></div>

<nav
	class:visible
	style:z-index={$overlay_open && (search.active || $on_this_page_open) ? 80 : null}
	aria-label="Primary"
>
	<a class="home-link" href="{webMountPoint}" title={home_title} aria-label="Svelte"></a>

	{#if title}
		<div class="current-section mobile">
			{title}
		</div>
	{/if}
	<div class="desktop">
		<div
			onmouseenter={() => (showMegaMenu = true)}
			onmouseleave={() => {
				showMegaMenu = false;
				hoveredMenu = null;
			}}
			role="navigation"
			style="position: relative"
			class="nav-links-center"
		>
			<div class="links">
				{#each links as link}
					<div 
						class="nav-item-wrapper"
						role="group"
						onmouseenter={() => {
							if (link.sections) {
								openDropdown = link.slug;
							}
							hoveredMenu = link.slug;
							showMegaMenu = true;
						}}
						onmouseleave={() => {
							if (link.sections) {
								openDropdown = null;
							}
							hoveredMenu = null;
						}}
						onfocusin={() => {
							if (link.sections) {
								openDropdown = link.slug;
							}
							hoveredMenu = link.slug;
							showMegaMenu = true;
						}}
						onfocusout={() => {
							if (link.sections) {
								openDropdown = null;
							}
							hoveredMenu = null;
						}}
					>
						<a
							href="/{link.slug}"
							onclick={() => {
								showMegaMenu = false;
								openDropdown = null;
							}}
							class:active={hoveredMenu === link.slug}
							class:current={isCurrentSection(link.slug)}
						>
							{link.title} {#if link.sections}
								<i class="nav-dropdown-icon fa-solid fa-caret-down"></i>
							{/if}
						</a>

						{#if link.sections}
							<div class="dropdown-menu" class:visible={openDropdown === link.slug}>
								<div class="dropdown-content">
									{#each link.sections as section}
										<a 
											href={section.path} 
											class="dropdown-item"
											onclick={() => {
												openDropdown = null;
											}}
										>
											<div class="dropdown-item-icon">
												<i class="{section.icon}" aria-label="{section.title} icon"></i>
											</div>
											<div class="dropdown-item-text">
												<div class="dropdown-item-title">{section.title}</div>
												{#if section.description}
													<div class="dropdown-item-description">{section.description}</div>
												{/if}
											</div>
										</a>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>


	</div>

	<div class="desktop desktop-secondary-nav">
		<AppSecondaryNav {user} {appMountPoint} {webMountPoint} />
	</div>

	<div class="mobile mobile-menu">
		<AppSecondaryNav {user} {appMountPoint} {webMountPoint} />
		<!-- @ts-ignore - menu_button type handled above -->
		<button
				bind:this={menu_button}
				aria-label="Toggle menu"
				aria-expanded={open}
				class="menu-toggle raised icon"
				class:open
				onclick={() => {
					open = !open;
				}}
			>
			<Icon name={open ? 'close' : 'menu'} size={16} />
		</button>
	</div>
</nav>

{#if open}
	<div class="mobile">
		<MobileMenu {links} {current} {user} onclose={() => (open = false)} />
	</div>
{/if}

<style>

	/* Navigation backdrop element */
	.nav-backdrop {
		position: fixed;
		left: 0;
		width: 100vw;
		height: var(--sk-nav-height);
		z-index: 100; /* Behind nav but above content */
		transition: all 0.3s ease;

		/* Desktop positioning (top) */
		top: 0;

		/* Default state */
		&.default {
			background-color: var(--sk-bg-1);
		}

		/* Mobile menu open state */
		&.mobile-open {
			background-color: rgba(255, 255, 255, 0.85);
		}

		/* Mega menu active state */
		&.mega-menu-active {
			background-color: var(--sk-bg-1);
		}

		/* Dark mode backdrop effects */
		:root.dark &.default {
			background: rgba(17, 17, 17, 0.8);
			backdrop-filter: blur(20px);
		}

		:root.dark &.mobile-open {
			background: rgba(17, 17, 17, 0.6);
			backdrop-filter: blur(20px);
		}

		:root.dark &.mega-menu-active {
			background: rgba(17, 17, 17, 0.1);
			backdrop-filter: blur(20px);
		}

		/* Bottom border for desktop */
		&::after {
			content: '';
			position: absolute;
			left: 0;
			top: var(--sk-nav-height);
			width: 100%;
			height: 0.5px;
			background: rgba(0, 0, 0, 0.2);
		}

		:root.dark &::after {
			background: rgba(100, 100, 100, 0.3);
		}

		/* Mobile positioning (bottom) */
		@media (max-width: 1148px) {
			top: unset;
			bottom: 0;

			/* Top border for mobile (since nav is at bottom) */
			&::after {
				top: unset;
				bottom: var(--sk-nav-height);
			}
		}
	}

	nav {
		position: fixed;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		width: 100vw;
		top: 0;
		z-index: 1000;
		width: 100vw;
		height: var(--sk-nav-height);
		margin: 0 auto;
		padding: 0;
		background: transparent; /* Now transparent - backdrop handles background */
		font-family: var(--sk-font-family-body);
		user-select: none;
		isolation: isolate;
		font-family: var(--sk-font-family-ui);
	}

	a {
		font: var(--sk-font-ui-medium);
	}

	.current-section {
		display: flex;
		align-items: center;
		color: inherit;
		margin-left: 0.4em;
		font: var(--sk-font-ui-medium);
	}

	@media (max-width: 1148px) {
		nav {
			transition: transform 0.2s;
		}

		nav:not(.visible):not(:focus-within) {
			transform: translate(0, calc(var(--sk-nav-height)));
		}
	}

	.nav-dropdown-icon {
		font-size: 12px;
		margin-left: 0.7rem;
	}

	.nav-item-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.links {
		display: flex;
		/* width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center; */
		/* margin-left: 16px; */
	}

	/* Main navigation link styles - only for direct children */
	.nav-item-wrapper > a {
		color: var(--sk-fg-3);
		font: var(--sk-font-ui-medium);
		white-space: nowrap;
		height: 100%;
		display: flex;
		align-items: center;
		text-decoration: none;
		outline-offset: -2px;
		font-weight: 500;
		position: relative;
		z-index: 1002; /* Above the mega menu */
		font-size: 14px;
		margin: 0 0.5rem;
		padding: 0.75rem 2rem;

		&:hover {
			/* opacity: 1; */
			/* background-color: var(--sk-fg-accent); */
			background-color: var(--sk-bg-3);
			color: var(--sk-fg-2);
			border-radius: 5px;
			transition: all 0.2s ease;

		}

		&.current {
			color: var(--sk-fg-1);
			background-color: var(--sk-bg-3);
			border-radius: 5px;				
		}

		/* &[aria-current='page']::after {
			opacity: 1;
			background-color: var(--sk-fg-accent);
		} */
	}

	/* Dropdown Menu Styles */
	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1001;
		padding-top: 12px;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.2s ease, visibility 0.2s ease;
		pointer-events: none;

		&.visible {
			opacity: 1;
			visibility: visible;
			pointer-events: all;
		}
	}

	.dropdown-content {
		background: var(--sk-bg-0);
		border: 1px solid var(--sk-bg-4);
		border-radius: 8px;
		padding: 0;
		min-width: 280px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

		:root.dark & {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
			border-color: var(--sk-raised-highlight);
		}
	}

	.dropdown-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		border-radius: 6px;
		text-decoration: none;
		color: var(--sk-fg-2);
		transition: all 0.2s ease;
		margin: 0 !important;
		height: auto !important;

		&:hover {
			background-color: var(--sk-bg-3);
			color: var(--sk-fg-1);
		}
	}

	.dropdown-item-icon {
		width: 40px;
		height: 40px;
		border-radius: 6px;
		background-color: var(--sk-bg-0);
		border: 1px solid var(--sk-bg-4);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 0.2rem;

		i {
			font-size: 14px;
			color: var(--sk-fg-3);
		}
	}

	.dropdown-item-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.dropdown-item-title {
		font: var(--sk-font-ui-medium);
		font-weight: 600;
		font-size: 14px;
		color: inherit;
	}

	.dropdown-item-description {
		font: var(--sk-font-ui-small);
		font-size: 12px;
		color: var(--sk-fg-3);
		line-height: 1.4;
	}

	.menu {
		position: relative;
		display: flex;
		width: 100%;
		gap: 0.5rem;
	}

	.home-link {
		--padding-right: 1rem;
		margin-left: 1.5rem;
		width: 8.4rem;
		height: 100%;
		background: url(../branding/econic_logo.svg) no-repeat 0 50% / calc(100% - var(--padding-right))
			auto;
		padding: 0 var(--padding-right) 0 calc(var(--sk-page-padding-side) + 0rem);

		/* :root.dark & {
			background-image: url(../branding/econic_logo.svg);
		} */


		/* &.in_app {
			background: url(../branding/econic_logo_letter.svg) no-repeat 0 50% / calc(100% - var(--padding-right)) auto;
		} */
	}

	.mobile-menu {
		display: flex;
		flex: 1;
		justify-content: end;
		align-items: center;
		gap: 0.5rem; /* TODO tokenize */
		padding-right: 1rem;
	}

	.desktop {
		display: none;
	}

	nav :global(.small) {
		display: block;
	}

	@media (max-width: 1148px) {
		nav {
			top: unset;
			bottom: 0;
		}

		.menu {
			position: relative;
			display: none;
			width: 100%;
			background: var(--sk-bg-1);
			padding: 1rem var(--sk-page-padding-side);
		}

		nav :global(.large) {
			display: none;
		}
	}

	@media (min-width: 480px) {
		.home-link {
			margin-left: 1.5rem;
			width: 10.2rem;
			/* background: url(../branding/econic_logo.svg) no-repeat 0 50% /
				calc(100% - var(--padding-right)) auto; */
			background: url(../branding/econic_logo_letter.svg) no-repeat 0 50% / calc(100% - var(--padding-right)) auto;
			width: 3.5rem;

			padding: 0 var(--padding-right) 0 calc(var(--sk-page-padding-side) + 0rem);
			/* width: 3.5rem; */
/* 
			:root.dark & {
				background-image: url(../branding/econic_logo.svg);
			} */

			/* &.in_app {
				background: url(../branding/econic_logo_letter.svg) no-repeat 0 50% / calc(100% - var(--padding-right)) auto;
				width: 3.5rem;
			} */
		}
	}

	@media (min-width: 1149px) {
		.home-link {
			/* margin-right: 40px;
			margin-left: 20px; */
			margin: 0 12px 0 2rem;
			width: 115px;
			background: url(../branding/econic.svg) no-repeat 0 50% /
				calc(100% - var(--padding-right)) auto;			
		}

		nav {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;

			/* &::after { */
			/* top: auto; */
			/* bottom: -4px; */
			/* background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent); */
			/* } */
		}

		.home-link {
			justify-self: start;
		}

		.desktop {
			justify-self: center;
			height: 100%;
		}

		.mobile-menu {
			justify-self: end;
		}

		.desktop-secondary-nav {
			justify-self: end;
			height: 100%;
			display: flex;
			align-items: center;
		}

		.menu {
			display: flex;
			width: auto;
			height: 100%;
			align-items: center;
		}

		.menu:last-child {
			justify-content: end;
		}

		.mobile {
			display: none;
		}

		.desktop {
			display: contents;
		}

		nav :global(.small) {
			display: none;
		}
	}

	a {
		&:hover {
			text-decoration: none !important;
		}
	}

	.nav-links-center {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

</style>



