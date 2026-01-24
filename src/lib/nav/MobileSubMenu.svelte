<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import type { NavigationLink } from '../types';
	import { onMount } from 'svelte';

	let { title, contents = [] }: { title: string; contents: NavigationLink['sections'] } = $props();

	// Helper to prepend base to internal paths
	function href(path: string | undefined): string {
		if (!path) return base + '/';
		if (path.startsWith('http')) return path;
		return base + path;
	}

	let nav = $state() as HTMLElement;
	let nav_inner = $state() as HTMLElement;
	
	// Store the current pathname to avoid nested store subscriptions
	let currentPathname = $derived($page.url.pathname);

	onMount(() => {
		scrollToActive();
	});

	export async function scrollToActive() {
		const active = nav.querySelector('[aria-current="page"]') as HTMLElement;

		if (!active) {
			nav.scrollTop = 0;
			return;
		}

		const nav_center = nav.offsetHeight / 2;
		const child_center = active.offsetHeight / 2;
		const offset_top = active.offsetTop;
		const scroll_position = offset_top - nav_center + child_center;

		const update_scroll = () => (nav.scrollTop = scroll_position);

		requestAnimationFrame(update_scroll);
	}
</script>

<nav bind:this={nav}>
	<div class="nav-inner" bind:this={nav_inner}>
		<section>
			<h2>{title}</h2>
			
			{#if contents && contents.length > 0}
				<ul>
					{#each contents as item}
						<li>
							{#if item.sections && item.sections.length > 0}
								<!-- This is a section with sub-items (like Documentation or Research) -->
								 <ul>
								{#each item.sections as section}
									<li class="section-group">
										{#if section.sections && section.sections.length > 0}
											<!-- Section header (not clickable, like "INTRO", "PLATFORM") -->
											<h3 class="section-title">
												{section.title}
											</h3>
											<ul>
												{#each section.sections as page}
													<li>
														<a
															class="page second-level"
															aria-current={page.path === currentPathname ? 'page' : undefined}
															href={href(page.path)}
														>
															{page.title}
														</a>
													</li>
												{/each}
											</ul>
										{:else if section.path}
											<!-- Direct page link (like blog posts) -->
											<a href={href(section.path)} aria-current={section.path === currentPathname ? 'page' : undefined}>
												{section.title}
											</a>
										{/if}
									</li>
								{/each}
							</ul>
							{:else if item.path}
								<!-- Simple direct link -->
								<a href={href(item.path)} aria-current={item.path === currentPathname ? 'page' : undefined}>
									{item.title}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</nav>

<style>
	nav {
		padding: 0 0 3rem 0;
		font-family: var(--sk-font-family-ui);
		overflow-y: auto;
		height: 100%;
		position: relative;
	}

	.nav-inner {
		min-height: min-content;
	}

	section {
		padding: 1rem 3.2rem;

		& > ul {
			margin-bottom: 0 0 2rem 0;
		}

		ul {
			list-style-type: none;
			margin: 0;
			margin-bottom: 2.5rem;
		}

		li {
			display: block;
		}
	}

	h2 {
		position: sticky;
		top: 0;
		z-index: 1;
		padding: 1rem 0;
		background-color: var(--sk-bg-2);
		font: var(--sk-font-ui-medium);
		color: var(--sk-fg-1);
		margin: 0;

		/* a {
			color: inherit;
			text-decoration: none;
		} */
	}

	.section-title {
		color: var(--sk-fg-4);
		font-weight: 300;
		font-size: var(--sk-font-ui-small);
		text-transform: uppercase;
		margin: 1rem 0 1.2rem 0;
	}

	.section-group {
		margin-bottom: 2rem;
		margin-top: 1rem;
	}

	h3 {
		display: block;
		margin: 1rem 0 1.2rem 0;
		color: var(--sk-fg-4);
		font-weight: 300;
		font-size: var(--sk-font-ui-small);
		text-transform: uppercase;

		/* a {
		color: var(--sk-fg-1);
			text-decoration: none;
			font-weight: 400;
			text-transform: none;
			font-size: 1rem;
		} */
	}

	/* h4 {
		display: block;
		padding-bottom: 0.6rem;
		font: var(--sk-font-ui-medium);
		text-transform: uppercase;
		font-size: 0.9em;
		color: var(--sk-fg-4);
		font-weight: 300;
	} */

	a {
		display: block;
		font: var(--sk-font-body-small);
		position: relative;
		transition: color 0.2s;
		border-bottom: none;
		padding: 0.2rem;
		color: var(--sk-fg-2);
		user-select: none;
		text-wrap: balance;

		&[aria-current='page'] {
			color: var(--sk-fg-accent) !important;
			text-decoration: none;
		}
	}

	.second-level {
		position: relative;
		padding-left: 2rem;

		/* &::before {
			content: "";
			position: absolute;
			left: 4px;
			top: calc(min(15px, 50%));
			transform: translateY(-50%);
			width: 3px;
			height: 3px;
			background-color: var(--sk-fg-4);
			border-radius: 5px;
		} */

		&[aria-current='page']::before {
			background-color: var(--sk-fg-accent);
		}
	}

	.page {
		display: block;
		font: var(--sk-font-body-small);
	}

	ul ul,
	ul ul li {
		margin: 0;
	}
</style>
