<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Document } from '../types';

	interface Props {
		contents: Document[];
		show_ts_toggle?: boolean;
	}

	let { contents }: Props = $props();

	let nav: HTMLElement;

	afterNavigate(({ from, to }) => {
		// TODO the fact that we're referencing route IDs from the app indicates
		// that this doesn't belong in ui-kit, but that's a problem for another day
		if (from?.route.id !== '/docs/[...path]') {
			return;
		}

		const from_package = from.params!.path.split('/')[0];
		const to_package = to!.params!.path.split('/')[0];

		if (from_package !== to_package) {
			nav.scrollTo(0, 0);
		}
	});
</script>

<nav aria-label="Docs" bind:this={nav}>
	<ul class="sidebar">
		{#each contents ?? [] as section}
			
				{#if section.children && section.children.length > 0}
				<li class="section-group">
					<h3 class="section-title">
						{section.metadata.title}
					</h3>
					<ul>
						{#each section.children as { metadata, slug }}
							<li>
								<a
									class="page second-level"
									aria-current={`/${slug}` === $page.url.pathname ? 'page' : undefined}
									href="/{slug}"
								>
									{metadata.title}
								</a>
							</li>
						{/each}
					</ul>
				</li>
				{:else}
					<h3>
						<a 
							class="primary-level"
							aria-current={`/${section.slug}` === $page.url.pathname ? 'page' : undefined}
							href="/{section.slug}">
							{section.metadata.title}
						</a>
					</h3>
				{/if}
		{/each}
	</ul>
</nav>

<style>
	nav {
		top: 0;
		left: 0;
		color: var(--sk-fg-2);
		position: relative;
	}

	.sidebar {
		padding: 3.2rem 3.2rem calc(3.2rem + var(--sk-banner-height)) 3.2rem;
		font-family: var(--sk-font-family-body);
		/* height: 100%; */
		bottom: auto;
		width: 100%;
		margin: 0;
	}

	li {
		display: block;
		margin: 0;
		margin-bottom: 0rem;
	}

	li:last-child {
		margin-bottom: 0;
	}

	a {
		position: relative;
		transition: color 0.2s;
		border-bottom: none;
		padding: 0.2rem;
		padding-left: 2rem;
		color: inherit;
		user-select: none;
		text-wrap: balance;
	}

	.primary-level {
		margin: 0;
		padding-left: 0rem;
		color: var(--sk-fg-1);
	}

	.second-level {
		position: relative;
	}

	.section-title {
		color: var(--sk-fg-4);
		font-weight: 300;
		font-size: var(--sk-font-ui-small);
		text-transform: uppercase;
	}

	.section-group {
		margin-bottom: 1rem;
		margin-top: 1rem;
	}

	/* .second-level::before {
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

	[aria-current='page'].second-level::before {
		background-color: var(--sk-fg-accent);
	}

	h3 {
		margin: 1rem 0 1.2rem 0;
	}

	.page {
		display: block;
		font: var(--sk-font-body-small);
	}

	[aria-current='page'] {
		color: var(--sk-fg-accent);
		text-decoration: none;
	}

	ul ul,
	ul ul li {
		margin: 0;
	}

	@media (min-width: 832px) {
		.sidebar {
			columns: 1;
			padding-left: 3.2rem;
			padding-right: 2rem;
			padding-top: var(--sk-page-padding-top);
			padding-bottom: var(--sk-page-padding-bottom);
			width: var(--sidebar-menu-width);
			margin: 0 0 0 auto;
			display: flex;
			flex-direction: column;
			min-height: 100%;
			gap: 1rem;
		}

		nav {
			max-height: calc(100vh - var(--sk-nav-height));
			overflow-x: hidden;
			overflow-y: auto;
		}

		:global(.scrollbars-invisible) [aria-current='page']::after {
			--size: 1.8rem;
			content: '';
			position: absolute;
			width: var(--size);
			/* height: var(--size); */
			top: calc(1.4rem - var(--size) * 0.5);
			right: calc(-0.5 * var(--size));
			background-color: var(--sk-bg-1);
			z-index: 2;
			position: absolute;
			rotate: 45deg;
			box-shadow: 0 0 3px rgba(0, 0, 0, 0.12);
		}
	}
</style>
