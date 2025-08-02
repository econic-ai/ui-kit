<script lang="ts">
	import { assistant } from '../state';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '../branding/econic_logo_letter.svg?raw';

	function handleButtonClick() {
		assistant.toggle();
	}

	function handleClose() {
		assistant.close();
	}
</script>

<!-- Floating Action Button -->
<button
	class="floating-button"
	onclick={handleButtonClick}
	aria-label="Open AI Assistant"
>
	{@html Icon}
</button>

<!-- Assistant Box -->
{#if assistant.isOpen}
	<div
		class="assistant-box"
		transition:fly={{ 
			duration: 300, 
			y: 100, 
			opacity: 0, 
			easing: quintOut 
		}}
		role="dialog"
		aria-label="AI Assistant"
	>
		<div class="assistant-header">
			<button
				class="close-button"
				onclick={handleClose}
				aria-label="Close AI Assistant"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
		<div class="assistant-content">
			<!-- Content will be added in future steps -->
		</div>
	</div>
{/if}

<style>
	.floating-button {
		position: fixed;
		bottom: 4rem;
		right: 4rem;
		width: 8rem;
		height: 8rem;
		border-radius: 50%;
		border: none;
		background: var(--sk-bg-0);
		color: var(--bg-1);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
		transition: all 0.2s ease;
		z-index: 9998;
	}

	.floating-button:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 1);
		background: var(--sk-bg-1);
	}

	.floating-button :global(svg) {
		width: 2.5rem;
		height: 2.5rem;
		fill: currentColor;
	}

	.assistant-box {
		position: fixed;
		bottom: 12rem;
		right: 12rem;
		width: 500px;
		max-width: calc(100vw - 4rem);
		height: 800px;
		max-height: calc(100vh - 10rem);
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		
		/* Dark theme gradient - subtle dark to darker */
		background: linear-gradient(135deg, 
			rgba(0, 0, 0, 0.45) 0%, 
			rgba(0, 0, 0, 0.95) 100%
		);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Light theme styles */
	:global(.light) .assistant-box {
		background: linear-gradient(135deg, 
			rgba(255, 255, 255, 0.95) 0%, 
			rgba(255, 255, 255, 0.85) 100%
		);
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	:global(.light) .assistant-backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	.assistant-header {
		padding: 1rem;
		display: flex;
		justify-content: flex-end;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.light) .assistant-header {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.close-button {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.light) .close-button {
		background: rgba(0, 0, 0, 0.05);
		color: rgba(0, 0, 0, 0.6);
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.2);
		color: white;
	}

	:global(.light) .close-button:hover {
		background: rgba(0, 0, 0, 0.1);
		color: black;
	}

	.assistant-content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}

	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.floating-button {
			bottom: 1rem;
			right: 1rem;
			width: 4rem;
			height: 4rem;
		}

		.floating-button :global(svg) {
			width: 2rem;
			height: 2rem;
		}

		.assistant-box {
			bottom: 0;
			right: 0;
			left: 0;
			width: 100%;
			max-width: 100%;
			height: 80vh;
			max-height: 100vh;
			border-radius: 1rem 1rem 0 0;
		}
	}
</style> 