<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import HoverMenu from './HoverMenu.svelte';
	import Icon from './Icon.svelte';

	let { children } = $props();
</script>

<Dropdown align="right">
	<div class="target">
		<span class="wrench" role="presentation"></span>
		<Icon name="chevron-down" />
	</div>

	{#snippet dropdown()}
		<HoverMenu>
			{@render children()}
		</HoverMenu>
	{/snippet}
</Dropdown>

<style>
	.target {
		text-transform: uppercase;
		font: var(--sk-font-ui-small);
		position: relative;
		display: flex;
		align-items: center;

		height: 100%;
		padding: 0 0.8rem;
		gap: 0.5rem;
		z-index: 2;
	}

	span.wrench {
		--icon-size: 1.8rem;
		width: 1.8rem;
		height: 1.8rem;
		z-index: 9999;
		background: url(../icons/wrench-light.svg) no-repeat 50% 50%;
		background-size: contain;

		:root.dark & {
			background-image: url(../icons/wrench-dark.svg);
		}
	}
</style>
