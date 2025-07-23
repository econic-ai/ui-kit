<!-- @component
The main shell of the application. It provides a slot for the top navigation, the main content, and the bottom banner.
-->

<script lang="ts">
	import '../styles/index.sass';
	import { navigating } from '$app/stores';
	import { overlay_open } from '../stores';
	import PreloadingIndicator from '../nav/PreloadingIndicator.svelte';
	import SkipLink from '../nav/SkipLink.svelte';
	import Icons from './Icons.svelte';
	import ModalOverlay from './ModalOverlay.svelte';

	let { nav_visible = true, top_nav, children, banner, footer } = $props();


</script>

<Icons />

{#if $navigating}
	<PreloadingIndicator />
{/if}

{#if nav_visible}
	<SkipLink href="#main" />

	{@render top_nav?.()}
{/if}

{#if $overlay_open}
	<ModalOverlay />
{/if}

<main id="main">
	{@render children?.()}
	{@render footer?.()}
</main>

{@render banner?.()}

<style>
	main {
		position: absolute;
		margin: 0 auto;
		/* padding-top: var(--sk-banner-height); */
		padding-bottom: 0;
		height: calc(100% - var(--sk-nav-height));
		overflow-y: auto;
		scroll-behavior: smooth;
		height: calc(100vh - var(--sk-nav-height));
		width: 100%;
		top: var(--sk-nav-height);
	}

	@media (max-width: 832px) {
		main {
			top: 0;
			height: 100vh;
			/* padding-bottom: var(--sk-nav-height); */
		}
	}
</style>
