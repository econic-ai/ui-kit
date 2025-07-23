<script lang="ts">
	import { overlay_open, on_this_page_open } from '../stores';
	import { search } from '../state/search.svelte';
	import { Icon, ThemeToggle } from '../components';
	import { page } from '$app/stores';
	import MobileMenu from './MobileMenu.svelte';
	import SecondaryNav from './SecondaryNav.svelte';
	import { tick } from 'svelte';
	import type { NavigationLink } from '../types';
	
	let { home_title = 'Homepage', title, links, session, user } = $props();

	let visible = $state(true);

	let showMegaMenu = $state(false);

	// mobile nav stuff
	let open = $state(false);
	// @ts-ignore - esrap parser has issues with generic type annotations
	let current = $state.raw();
	// @ts-ignore - esrap parser has issues with HTMLButtonElement type annotations
	let menu_button;
	
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

	let hoveredMenu: string | null = null;

	// Function to check if current URL matches the link href
	// @ts-ignore - esrap parser has issues with function parameter type annotations
	function isCurrentPage(href) {
		return $page.url.pathname === href;
	}

	// @ts-ignore - esrap parser has issues with function parameter type annotations
	function isCurrentSection(slug) {
		return $page.url.pathname.startsWith('/' + slug);
	}

</script>

<svelte:window
	onscroll={handle_scroll}
	onhashchange={handle_hashchange}
	onkeydown={(e) => {
		if (open && e.key === 'Escape') {
			open = false;
			// we only manage focus when Esc is hit
			// otherwise, the navigation will reset focus
			tick().then(() => menu_button.focus());
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
	<a class="home-link" href="/" title={home_title} aria-label="Svelte"></a>

	{#if title}
		<div class="current-section mobile">
			{title}
		</div>
	{/if}
	<div class="desktop">
		<div
			onmouseenter={() => (showMegaMenu = true)}
			role="navigation"
			style="position: relative"
			class="nav-links-center"
		>
			<div class="links">
				{#each links as link}
					<a
						href="/{link.slug}"
						onmouseenter={() => {
							hoveredMenu = link.slug;
							showMegaMenu = true;
						}}
						onfocus={() => {
							hoveredMenu = link.slug;
							showMegaMenu = true;
						}}
						onclick={() => {
							showMegaMenu = false;
						}}
						class:active={hoveredMenu === link.slug}
					>
						{link.title}
					</a>
				{/each}
			</div>
		</div>

		<div
			class="mega-menu"
			class:visible={showMegaMenu}
			onmouseenter={() => (showMegaMenu = true)}
			onmouseleave={() => (showMegaMenu = false)}
			role="navigation"
		>
				<div
					class="mega-menu-grid"
				>
					{#each links as link}
						{#if link.sections}
							<div class="mega-column {hoveredMenu === link.slug ? 'active' : ''}">
								<!-- Section icon at the top -->
								
								<a class="section-title __text_md" href={'/' + link.slug} class:selected={isCurrentSection(link.slug)}>
									<!-- <div class="section-icon-wrapper">
										<img
											src="/logos/logo_mg.png"
											alt={link.title + ' icon'}
											class="icon"
											width="64"
											height="64"
										/>
									</div> -->
									<!-- <div class="subIcon-box larger">
										<i
											class="menu-item-icon {isCurrentSection(link.slug) ? link.iconActive ?? link.icon : link.icon}"
											aria-label={link.title + ' icon'}
										></i>
									</div> -->
									{link.title}
									<!-- {#if link.subtitle}
										<p class="section-subtitle">{link.subtitle}</p>
									{/if} -->
								</a>
								
								<div class="menu-sub-items">
									{#each link.sections as item}
										<a
											class="menu-sub-item"
											href={item.path || '#'}
											class:active={hoveredMenu === link.slug}
											class:selected={isCurrentPage(item.path || '')}
										>
											<div class="subIcon-box">
												<i
													class="menu-item-icon {isCurrentPage(item.path || '') ? item.iconActive ?? item.icon : item.icon}"
													aria-label={item.title + ' icon'}
												></i>
											</div>
											<div class="menu-sub-item-content">
												<span class="menu-item-title">{item.title}</span>
												{#if item.description}
													<span class="menu-item-description __text_sm">{item.description}</span>
												{/if}
											</div>
										</a>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
	</div>

	<div class="desktop desktop-secondary-nav">
		<SecondaryNav {user} {session} />
	</div>

	<div class="mobile mobile-menu">
		<SecondaryNav {user} {session} />
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
		<MobileMenu {links} {current} {user} {session} onclose={() => (open = false)} />
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
			-webkit-backdrop-filter: blur(15px);
			        backdrop-filter: blur(15px);
		}

		:root.dark &.mobile-open {
			background: rgba(17, 17, 17, 0.6);
			-webkit-backdrop-filter: blur(15px);
			        backdrop-filter: blur(15px);
		}

		:root.dark &.mega-menu-active {
			background: rgba(17, 17, 17, 0.1);
			-webkit-backdrop-filter: blur(15px);
			        backdrop-filter: blur(15px);
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
		@media (max-width: 1048px) {
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
		z-index: 101;
		width: 100vw;
		height: var(--sk-nav-height);
		margin: 0 auto;
		padding: 0;
		background: transparent; /* Now transparent - backdrop handles background */
		font-family: var(--sk-font-family-body);
		-webkit-user-select: none;
		   -moz-user-select: none;
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

	@media (max-width: 1048px) {
		nav {
			transition: transform 0.2s;
		}

		nav:not(.visible):not(:focus-within) {
			transform: translate(0, calc(var(--sk-nav-height)));
		}
	}

	.links {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		/* margin-left: 16px; */

		a {
			color: inherit;
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

			&::after {
				content: '';
				position: absolute;
				bottom: 0px;
				left: 0;
				width: 100%;
				height: 0.5px;
				opacity: 0;
				transition: opacity 0.2s ease;
				z-index: 1002; /* Above the mega menu */
			}

			&:hover::after {
				opacity: 1;
				background-color: var(--sk-fg-accent);
			}

			&[aria-current='page']::after {
				opacity: 1;
				background-color: var(--sk-fg-accent);
			}

			&:not(.secondary) {
				padding: 1.25rem;
			}

			&.secondary {
				box-shadow: none;
				line-height: 1;
				padding: 2rem;

				&[aria-current='page'] {
					color: var(--sk-fg-accent);
					/* box-shadow: inset 0 -1px 0 0 var(--sk-fg-accent); */
				}

				&::after {
					background-color: transparent;
				}
			}
		}
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

		:root.dark & {
			background-image: url(../branding/econic_logo.svg);
		}
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

	@media (max-width: 1048px) {
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
			background: url(../branding/econic_logo.svg) no-repeat 0 50% /
				calc(100% - var(--padding-right)) auto;
			padding: 0 var(--padding-right) 0 calc(var(--sk-page-padding-side) + 0rem);

			:root.dark & {
				background-image: url(../branding/econic_logo.svg);
			}
		}
	}

	@media (min-width: 1049px) {
		.home-link {
			/* margin-right: 40px;
			margin-left: 20px; */
			margin: 0 12px 0 2rem;
			width: 115px;
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

	.mega-menu {
		position: absolute;
		top: var(--sk-nav-height); /* Ensure it drops just below nav */
		left: 0;
		width: 100vw; /* Take up full screen */
		padding: 1rem;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		z-index: 1001;
		padding-bottom: 4rem;
		
		/* Background handled by backdrop element, but mega menu needs its own background */
		background-color: rgba(255, 255, 255, 0.6); /* semi-transparent white for light mode */
		backdrop-filter: blur(15px); /* Keep backdrop filter for mega menu content area */
		-webkit-backdrop-filter: blur(15px); /* for Safari support */
		
		/* Visibility and transition controls */
		opacity: 0;
		visibility: hidden;
		transform: translateY(-10px);
		transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
		pointer-events: none;
	}

	.mega-menu.visible {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		pointer-events: auto;
	}

	.mega-menu-grid {
		-moz-columns: auto;
		     columns: auto;
		-moz-column-width: 250px;
		     column-width: 250px;
		-moz-column-gap: 0rem;
		     column-gap: 0rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.section-icon-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-icon-wrapper .icon {
		width: 4vw;
		height: 4vw;
		max-width: 80px;
		max-height: 80px;
		-o-object-fit: contain;
		   object-fit: contain;
		margin-bottom: 2rem;
	}

	.mega-column {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-self: start;
		-moz-column-break-inside: avoid;
		     break-inside: avoid;
		margin-bottom: 2rem;
	}

	.mega-column h3 {
		font-family: Inter;
		font-style: normal;
		font-weight: 600;
		font-size: 1.6rem;
		line-height: 2rem;
	}

	.mega-column a {
		transition: color 0.3s ease, -webkit-text-decoration 0.3s ease;
		transition: color 0.3s ease, text-decoration 0.3s ease;
		transition: color 0.3s ease, text-decoration 0.3s ease, -webkit-text-decoration 0.3s ease;
	}

	.mega-column a:hover {
		color: var(--sk-fg-1);
		text-decoration: underline;
	}

	.menu-sub-item-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.menu-item-title {
		font-weight: 400;
		font-size: 14px;
		
	}

	.menu-item-description {
		color: var(--sk-fg-3);
		font-family: Inter;
		font-style: normal;
		font-weight: 300;
		font-size: 1.2rem;
		line-height: 1.5rem;
		width: 100%;
		margin: 0;
	}

	.menu-sub-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		/* padding-top: 1.5rem; */
	}

	.menu-sub-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
		/* transition: color 2s ease; */
		padding: 0.5rem 1rem 0.5rem 0.5rem;
		margin: 0 0.5rem;

		transition:
			color 2s ease,
			background-color 3s ease,
			border-color 0.3s ease,
			border-radius 0.3s ease;

		/* gap: 1rem; */
		border-radius: 12px;
		border-style: solid;
		border-color: transparent;
		border-width: thin;
		text-decoration: none;
		/* background-color: black;	 */

		&:hover {
			color: var(--sk-fg-accent, #0070f3);
			background-color: var(--sk-bg-2);
			transition: background-color 0.3s ease;

			/* border-color: hsla(var(--sk-fg-1), 8%, 10%, 0.85); */
		}

	}

	.subIcon-box {
		width: 42px;
		height: 42px;
		border-radius: 8px;
		background-color: var(--sk-bg-1);
		transition: background-color 0.3s ease;
		flex-shrink: 0;
		border: 0.5px solid var(--sk-bg-4);
		display: flex;              
		align-items: center;        
		justify-content: center;   
	}

	.subIcon-box.larger {
		width: 64px;
		height: 64px;
		margin-bottom: 8px;

		.menu-item-icon {
			font-size: 18px;
		}
	}

	.menu-item-icon {
		font-size: 14px;
		color: var(--sk-fg-3);
		transition: color 0.3s ease;
	}

	.menu-sub-item:hover .subIcon-box, .section-title:hover .subIcon-box {
		background-color: var(--sk-bg-2);
		/* background-color: var(--sk-fg-2) !important; */
		transition: background-color 0.3s ease;
	}

	.menu-sub-item:hover .menu-item-icon, .section-title:hover .menu-item-icon {
		color: var(--sk-fg-2);

	}

	/* Selected state - inverts colors and overrides hover */
	.menu-sub-item.selected .subIcon-box, .section-title.selected .subIcon-box {
		background-color: var(--sk-fg-2) !important;
		border-color: var(--sk-fg-1) !important;
		font-weight: 800 !important;
	}

	.menu-sub-item.selected .menu-item-icon, .section-title.selected .menu-item-icon {
		color: var(--sk-bg-1) !important;
	}

	/* .mega-column.active {
		border: 2px solid var(--sk-fg-accent, #0070f3);
		background: rgba(0, 112, 243, 0.05); 
	} */

	.links a.active {
		color: var(--sk-fg-accent, #0070f3);
	}

	.section-title {
		font-weight: 500;
		/* font-size: 2rem; */
		transition: color 0.3s ease;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0rem;
		border-radius: 12px;
		text-decoration: none;

		&:hover {
			/* color: var(--sk-fg-accent, #0070f3); */
			/* background-color: var(--sk-bg-2); */
			transition: background-color 0.3s ease;
		}
	}

	.section-subtitle {
		font-size: 1.2rem;
		color: var(--sk-fg-3);
		margin: 0 0 0.5rem 0;
		font-weight: 400;
		line-height: 1.4;
	}

	:root.dark .mega-menu {
		background-color: hsla(var(--sk-bg-hue), 8%, 10%, 0.85); /* darker for dark mode */
		color: white;
		border-color: #333;
	}

	:root.dark .mega-column a {
		color: var(--sk-fg-1);
	}

	/* :root.dark .mega-column a:hover {
		color: var(--sk-fg-accent, #00ffd5);
	} */

	/* :root.dark .subIcon-box {
		background-color: var(--sk-bg-1, #333);
	} */

	/* :root.dark .menu-sub-item:hover .subIcon-box {
		background-color: var(--sk-fg-accent, #00ffd5);
	} */
</style>



