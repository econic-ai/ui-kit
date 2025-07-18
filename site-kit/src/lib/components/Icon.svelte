<script lang="ts">
	import { onMount } from 'svelte';
	let {
		name,
		size = 15
	}: {
		name: string;
		size?: string | number;
	} = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

</script>

<!-- {#if mounted} -->
<div class="dropdown-icon">
	<svg width={size} height={size}>
		<use href="#{name}" />
	</svg>
</div>
<!-- {/if} -->

<style>
	.dropdown-icon {
		margin-left: 3px;
		min-width: 15px;
	}
	svg {
		position: relative;
		overflow: hidden;
		vertical-align: middle;
		-o-object-fit: contain;
		object-fit: contain;
		-webkit-transform-origin: center center;
		transform-origin: center center;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}
</style>
