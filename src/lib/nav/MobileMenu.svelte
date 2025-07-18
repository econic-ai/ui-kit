<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { trap } from '../actions';
	import { reduced_motion } from '../stores';
	import { tick } from 'svelte';
	import { expoOut, quintOut } from 'svelte/easing';
	import type { TransitionConfig } from 'svelte/transition';
	import Icon from '../components/Icon.svelte';
	import MobileSubMenu from './MobileSubMenu.svelte';
	import type { NavigationLink } from '../types';
	import ModalOverlay from '../components/ModalOverlay.svelte';
	import { page } from '$app/stores';

	interface Props {
		links: NavigationLink[];
		current: NavigationLink | undefined;
		onclose: () => void;
		user?: any;
		session?: { user?: any } | null;
	}

	let { links, current, onclose, user, session }: Props = $props();

	let show_context_menu = $state(false);

	let nav_context_instance: ReturnType<typeof MobileSubMenu> | undefined = $state();

	let menu_height = $state(0);
	let universal_menu_inner_height = $state(0);
	let ready = $state(false);

	let universal_menu: HTMLElement | undefined = $state();
	
	// Store current pathname to check active states
	let currentPathname = $derived($page.url.pathname);

	// Helper functions to check current page/section
	function isCurrentPage(href: string): boolean {
		return currentPathname === href;
	}

	function isCurrentSection(slug: string): boolean {
		return currentPathname.startsWith('/' + slug);
	}

	afterNavigate(onclose);


	$effect(() => {
		// this is necessary to ensure that the menu-background height
		// is applied without an animation
		setTimeout(() => {
			ready = true;
		});
	});

	function popup(node: HTMLElement, { duration = 400, easing = expoOut } = {}): TransitionConfig {
		const height = current ? node.clientHeight : universal_menu_inner_height;
		console.log(`Testing mobile nav, height: ${height}`);
		return {
			css: (t, u) =>
				$reduced_motion
					? `opacity: ${t}`
					: `transform: translate3d(0, ${(height * u) / 0.9}px, 0) scale(${0.9 + 0.1 * t})`,
			easing,
			duration
		};
	}
</script>

<ModalOverlay {onclose} />

<div class="menu" use:trap={{ reset_focus: false }}>
	<div class="mobile-main-menu" transition:popup={{ duration: 200, easing: quintOut }}>
		<div
			class="menu-background"
			class:ready
			style:height={show_context_menu ? '100%' : `${universal_menu_inner_height}px`}
		></div>

		<div
			class="clip"
			style:--height-difference="{menu_height - universal_menu_inner_height}px"
			ontransitionstart={(e) => {
				// console.log(`Testing mobile transition start, height`, menu_height, universal_menu_inner_height, menu_height - universal_menu_inner_height);
				const target = e.target as HTMLElement;

				if (!target?.classList.contains('viewport')) return;
				if (e.propertyName !== 'transform') return;

				// we need to apply a clip-path during the transition so that the contents
				// are constrained to the menu background, but only while the transition
				// is running, otherwise it prevents the contents from being scrolled
				const a = 'calc(var(--height-difference) + 1px)';
				const b = '1px';

				const start = show_context_menu ? a : b;
				const end = show_context_menu ? b : a;

				const container = e.currentTarget;

				container.style.clipPath = `polygon(0% ${start}, 100% ${start}, 100% 100%, 0% 100%)`;

				setTimeout(() => {
					container.style.clipPath = `polygon(0% ${end}, 100% ${end}, 100% 100%, 0% 100%)`;
				}, 0);
			}}
			ontransitionend={(e) => {
				// console.log(`Testing mobile transition end, height`, menu_height, universal_menu_inner_height, menu_height - universal_menu_inner_height);
				const target = e.target as HTMLElement;

				if (!target?.classList.contains('viewport')) return;
				if (e.propertyName !== 'transform') return;

				e.currentTarget.style.clipPath = '';

				// whenever we transition from one menu to the other, we need to move focus to the first item in the new menu
				if (!show_context_menu) {
					universal_menu?.querySelector('a')?.focus();
				}
			}}
		>
			<div
				class="viewport"
				class:reduced-motion={$reduced_motion}
				class:offset={show_context_menu}
				bind:clientHeight={menu_height}
			>
				<div class="universal" inert={show_context_menu} bind:this={universal_menu}>
					<div class="contents" bind:clientHeight={universal_menu_inner_height}>
						<ul class="nav-list">
							{#each links as link}
								<li class="nav-item">
									<a href="/{link.slug}" class="nav-link parent-link" aria-current={isCurrentSection(link.slug) ? 'page' : undefined}>
										<div class="icon-box">
											<i class="nav-icon {isCurrentSection(link.slug) ? link.iconActive ?? link.icon : link.icon}" aria-label="{link.title} icon"></i>
										</div>
										<span class="nav-text">{link.title}</span>
									</a>

									{#if link.sections && link.sections.length > 0}
										<ul class="sub-nav-list">
											{#each link.sections as section}
												<li class="sub-nav-item">
													{#if section.sections && section.sections.length > 0}
														<div class="nav-link-with-dropdown">
															<a href={section.path} class="nav-link child-link" aria-current={isCurrentPage(section.path || '') ? 'page' : undefined}>
																<div class="icon-box small">
																	<i class="nav-icon {isCurrentPage(section.path || '') ? section.iconActive ?? section.icon : section.icon}" aria-label="{section.title} icon"></i>
																</div>
																<span class="nav-text">{section.title}</span>
															</a>
															<button
																class="dropdown-button"
																onclick={async (event) => {
																	event.preventDefault();
																	// We'll need to pass the section data for tertiary navigation
																	current = { ...link, sections: [section] };
																	await tick();
																	show_context_menu = true;
																	await tick();
																	nav_context_instance?.scrollToActive();
																}}
																aria-label="Show {section.title} submenu"
															>
																<Icon name="arrow-right-chevron" size={16} />
															</button>
														</div>
													{:else}
														<a href={section.path} class="nav-link child-link" aria-current={isCurrentPage(section.path || '') ? 'page' : undefined}>
															<div class="icon-box small">
																<i class="nav-icon {isCurrentPage(section.path || '') ? section.iconActive ?? section.icon : section.icon}" aria-label="{section.title} icon"></i>
															</div>
															<span class="nav-text">{section.title}</span>
														</a>
													{/if}
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						</ul>


					</div>
				</div>

				<div class="context" inert={!show_context_menu}>
					{#if current}
						<MobileSubMenu
							bind:this={nav_context_instance}
							title={current.title}
							contents={current.sections}
						/>
					{/if}
				</div>

				<label class="back-button">
					<button
						class="raised icon"
						onclick={() => (show_context_menu = false)}
						inert={!show_context_menu}
					>
						<Icon name="arrow-left" size={18} />
					</button>
					<span>Back to main menu</span>
				</label>
			</div>
		</div>
	</div>
</div>

<style>
	.menu {
		display: block;
		position: fixed;
		left: 0px;
		bottom: var(--bottom, var(--sk-nav-height));
		z-index: 100;
		width: 100%;
		height: 70vh;
		border-radius: 1rem 1rem 0 0;
		overflow-y: hidden;
		overflow-x: hidden;
		pointer-events: none;
		transform: translate3d(0, 0, 0);
		filter: var(--sk-shadow);
	}

	.menu-background {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
		height: 99.5%;
		border-radius: 1rem 1rem 0 0;
		background: var(--background, var(--sk-bg-1));
		will-change: height;
		transition: 0.3s var(--quint-out);
		transition-property: none;

		&.ready {
			transition-property: height;
		}

		:root.dark & {
			border-top: solid 1px var(--sk-raised-highlight);
		}
	}

	.mobile-main-menu {
		height: 100%;
		contain: layout paint;
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	.clip {
		width: 100%;
		height: 100%;
		transition: clip-path 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		will-change: clip-path;
	}

	.viewport {
		position: relative;
		bottom: -1px;

		display: grid;
		width: 200%;
		height: 100%;
		grid-template-columns: 50% 50%;
		transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		grid-auto-rows: 100%;

		&.reduced-motion {
			/* we still want the transition events to fire for focus management */
			transition-duration: 0.01ms;
		}

		&.offset {
			transform: translate3d(-50%, 0, 0);
		}

		& > * {
			overflow-y: auto;
			transition: inherit;
			transition-property: transform, opacity;
		}

		& :global(a) {
			position: relative;
			padding: 0rem 0;
			color: inherit;
			/* width: 100%; */
			/* height: 100%; */
		}
	}

	.universal .contents {
		position: absolute;
		width: 50%;
		bottom: 0;
		padding: 2rem 1rem 1rem 2rem;
		max-height: 70vh;
		overflow-y: scroll;

		button {
			width: 2.4rem;
			height: 2.6rem;
		}
	}

	.context {
		position: relative;
		height: 100%;
		bottom: -7px;
		padding-bottom: 2rem;
	}

	.context-inner {
		height: 100%;
	}

	.back-button {
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 1rem;
		font: var(--sk-font-ui-medium);
		color: var(--sk-fg-3);
		background-color: var(--sk-bg-2);
		width: 50%;
		height: 4.8rem;
		padding: 0 var(--sk-page-padding-side);
	}

	.universal .contents,
	.context,
	.back-button {
		pointer-events: all;
	}

	.universal {
		ul {
			list-style: none;
			margin: 0;
		}

		li {
			display: flex;
			flex-direction: column;
		}

		hr {
			margin: 1rem 0;
			height: 1px;
			background: var(--sk-border);
			border: none;
		}
	}

	/* New navigation styles */
	.nav-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		gap: 0rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		padding: 1rem;
		border-radius: 12px;
		border: none;
		background-color: transparent;
		color: inherit;
		text-decoration: none;
		font: var(--sk-font-ui-medium);
		transition: all 0.2s ease;
		position: relative;

		&:hover {
			background-color: var(--sk-bg-3);
		}

		&[aria-current='page'] {
			color: inherit;

			/* .icon-box {
				background-color: var(--sk-fg-2);
				border-color: var(--sk-fg-1);
			}

			.nav-icon {
				color: var(--sk-bg-1);
			} */
		}
	}

	.parent-link {
		font-weight: 600;
		font-size: 1.5rem;
	}

	.child-link {
		font-size: 1.4rem;
		margin-left: 2rem;
	}

	.nav-link-with-dropdown {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		margin-left: 2rem;

		.nav-link {
			flex: 1;
			margin-left: 0;
		}
	}

	.dropdown-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 1px solid var(--sk-bg-4);
		background-color: var(--sk-bg-1);
		color: var(--sk-fg-3);
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;

		&:hover {
			background-color: var(--sk-bg-2);
			border-color: var(--sk-fg-3);
		}

		:global(svg) {
			width: 14px;
			height: 14px;
		}
	}

	.icon-box {
		width: 44px;
		height: 44px;
		border-radius: 8px;
		/* background-color: var(--sk-bg-1); */
		/* border: 1px solid var(--sk-bg-4); */
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;

		&.small {
			width: 32px;
			height: 32px;
			border-radius: 6px;
		}
	}

	/* .nav-link:hover .icon-box {
		background-color: var(--sk-bg-2);
		border-color: var(--sk-bg-4);
	} */

	.nav-icon {
		font-size: 16px;
		color: var(--sk-fg-3);
		transition: color 0.2s ease;
	}

	.icon-box.small .nav-icon {
		font-size: 14px;
	}

	.nav-text {
		flex: 1;
	}

	.sub-nav-list {
		display: flex;
		flex-direction: column;
		gap: 0rem;
	}

	.sub-nav-item {
		display: flex;
	}
</style>
