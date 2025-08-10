<script lang="ts">
	import { assistant } from '../state';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Icon from '../branding/econic_logo_letter.svg?raw';

	// Props
	let { targetElementId = '', targetElement = null } = $props<{
		targetElementId?: string;
		targetElement?: HTMLElement | null;
	}>();

	// Create reactive derived values
    const isOpen = $derived(assistant.isOpen);
    const persistedOffsets = $derived(assistant.offsets);
    const persistedSize = $derived(assistant.size);
	const dockConfig = $derived(assistant.dockConfig);
	const fullscreenConfig = $derived(assistant.fullscreenConfig);

	function handleButtonClick() {
		assistant.toggle();
	}

	function handleClose() {
		assistant.close();
	}

	function handlePin() {
		// If going into docked mode, exit fullscreen first
		if (!dockConfig.isDocked && fullscreenConfig.isFullscreen) {
			assistant.setFullscreen(false);
		}
		assistant.toggleDocked();
	}

	function handleFullscreen() {
		// If going into fullscreen mode, exit docked first
		if (!fullscreenConfig.isFullscreen && dockConfig.isDocked) {
			assistant.setDocked(false);
		}
		assistant.toggleFullscreen();
	}

    // Offsets relative to bottom-right corner
    const initialOffsets = persistedOffsets;

	// Dragging state with $state
	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartY = $state(0);
    // Position stored as offsets from right and bottom
    let currentRight = $state(initialOffsets.right);
    let currentBottom = $state(initialOffsets.bottom);

	// Resizing state with $state
	let isResizing = $state(false);
	let resizeStartX = $state(0);
	let resizeStartY = $state(0);
	let resizeStartWidth = $state(500);
	let resizeStartHeight = $state(800);
	let currentWidth = $state(persistedSize.width);
	let currentHeight = $state(persistedSize.height);

	// Divider dragging state
	let isDraggingDivider = $state(false);
	let dividerStartX = $state(0);
	let dividerStartWidth = $state(25);

	// Assistant box element reference
	let assistantBox: HTMLDivElement;

	// Get the target element
	const getTargetElement = () => {
		if (targetElement) return targetElement;
		if (targetElementId) return document.getElementById(targetElementId);
		return null;
	};

	// Update target element width when docked
	$effect(() => {
		const element = getTargetElement();
		if (element) {
			if (isOpen && dockConfig.isDocked) {
				// Set the target element to take remaining width
				element.style.width = `${100 - dockConfig.dockedWidth}vw`;
				element.style.paddingRight = ''; // Explicitly clear any leftover padding
				// Only apply transition when not actively dragging
				element.style.transition = isDraggingDivider ? 'none' : 'width 0.3s ease';
			} else {
				// Reset target element when not docked or closed
				element.style.width = '';
				element.style.paddingRight = ''; // Ensure padding is cleared
				element.style.transition = '';
			}
		}
	});

    function clampToViewport() {
        if (!isOpen || dockConfig.isDocked || fullscreenConfig.isFullscreen) return;

        // Ensure the assistant remains fully within the viewport from bottom-right anchoring
        const maxRight = Math.max(0, window.innerWidth - currentWidth);
        const maxBottom = Math.max(0, window.innerHeight - currentHeight);
        currentRight = Math.min(currentRight, maxRight);
        currentBottom = Math.min(currentBottom, maxBottom);

        // If the viewport shrinks such that width/height would push top/left offscreen, clamp size
        const allowedWidth = Math.max(300, window.innerWidth - currentRight);
        const allowedHeight = Math.max(400, window.innerHeight - currentBottom);
        currentWidth = Math.min(currentWidth, allowedWidth);
        currentHeight = Math.min(currentHeight, allowedHeight);
    }

    // Initialize offsets and size when opening
    $effect(() => {
        if (isOpen && !isDragging && !isResizing && !dockConfig.isDocked) {
            // Sync with persisted values if they've changed
            if (currentRight !== persistedOffsets.right || currentBottom !== persistedOffsets.bottom) {
                currentRight = persistedOffsets.right;
                currentBottom = persistedOffsets.bottom;
            }

            if (currentWidth !== persistedSize.width || currentHeight !== persistedSize.height) {
                currentWidth = persistedSize.width;
                currentHeight = persistedSize.height;
            }
        }
    });

    function handleDragStart(e: MouseEvent) {
        if (dockConfig.isDocked || fullscreenConfig.isFullscreen) return; // Disable dragging when docked or fullscreen
        isDragging = true;
        // compute current left/top from right/bottom offsets
        const currentLeft = window.innerWidth - currentRight - currentWidth;
        const currentTop = window.innerHeight - currentBottom - currentHeight;
        dragStartX = e.clientX - currentLeft;
        dragStartY = e.clientY - currentTop;
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        e.preventDefault();
    }

    function handleDragMove(e: MouseEvent) {
        if (!isDragging || dockConfig.isDocked || fullscreenConfig.isFullscreen) return;
        const newLeft = e.clientX - dragStartX;
        const newTop = e.clientY - dragStartY;
        currentRight = Math.max(0, window.innerWidth - newLeft - currentWidth);
        currentBottom = Math.max(0, window.innerHeight - newTop - currentHeight);
    }

    function handleDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        // Persist the new offsets
        assistant.setOffsets(currentRight, currentBottom);
    }

	function handleResizeStart(e: MouseEvent) {
		if (dockConfig.isDocked || fullscreenConfig.isFullscreen) return; // Disable corner resize when docked or fullscreen
		isResizing = true;
		resizeStartX = e.clientX;
		resizeStartY = e.clientY;
		resizeStartWidth = currentWidth;
		resizeStartHeight = currentHeight;
		document.addEventListener('mousemove', handleResizeMove);
		document.addEventListener('mouseup', handleResizeEnd);
		e.preventDefault();
		e.stopPropagation();
	}

    function handleResizeMove(e: MouseEvent) {
        if (!isResizing || dockConfig.isDocked || fullscreenConfig.isFullscreen) return;
        // Resize from top-left, so we need to invert the delta to expand upward/leftward
        const deltaX = resizeStartX - e.clientX;
        const deltaY = resizeStartY - e.clientY;

        currentWidth = Math.max(300, resizeStartWidth + deltaX);
        currentHeight = Math.max(400, resizeStartHeight + deltaY);
        // Offsets remain unchanged to keep bottom-right fixed
    }

    function handleResizeEnd() {
        isResizing = false;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        // Persist the new size; offsets unchanged
        assistant.setSize(currentWidth, currentHeight);
        assistant.setOffsets(currentRight, currentBottom);
    }

	// Divider drag handlers
	function handleDividerDragStart(e: MouseEvent) {
		isDraggingDivider = true;
		dividerStartX = e.clientX;
		dividerStartWidth = dockConfig.dockedWidth;
		document.addEventListener('mousemove', handleDividerDragMove);
		document.addEventListener('mouseup', handleDividerDragEnd);
		e.preventDefault();
	}

	function handleDividerDragMove(e: MouseEvent) {
		if (!isDraggingDivider) return;
		
		// Calculate new width based on mouse movement
		const deltaX = dividerStartX - e.clientX;
		const deltaPercent = (deltaX / window.innerWidth) * 100;
		const newWidth = Math.min(Math.max(15, dividerStartWidth + deltaPercent), 50);
		
		// Update assistant width
		assistant.setDockedWidth(newWidth);
	}

	function handleDividerDragEnd() {
		isDraggingDivider = false;
		document.removeEventListener('mousemove', handleDividerDragMove);
		document.removeEventListener('mouseup', handleDividerDragEnd);
	}

	// Calculate docked height based on target element
	const dockedHeight = $derived(() => {
		if (!dockConfig.isDocked) return '100vh';
		const element = getTargetElement();
		if (element) {
			const rect = element.getBoundingClientRect();
			return `${rect.height}px`;
		}
		return '100vh';
	});

	// Calculate fullscreen height based on target element
	const fullscreenHeight = $derived(() => {
		const element = getTargetElement();
		if (element) {
			const rect = element.getBoundingClientRect();
			return `${rect.height}px`;
		}
		return '100vh';
	});

	// Reset position when closing
	// $effect(() => {
	// 	if (!isOpen && (persistedPosition.x !== 0 || persistedPosition.y !== 0)) {
	// 		assistant.resetPosition();
	// 	}
	// });
</script>

<!-- Floating Action Button -->
{#if !isOpen}
	<button
		class="floating-button"
		onclick={handleButtonClick}
		aria-label="Open AI Assistant"
	>
		{@html Icon}
	</button>
{/if}

<!-- Assistant Box -->
{#if isOpen}
	<div
		bind:this={assistantBox}
		class="assistant-box"
		class:dragging={isDragging}
		class:resizing={isResizing}
		class:docked={dockConfig.isDocked}
		class:fullscreen={fullscreenConfig.isFullscreen}
        style="{fullscreenConfig.isFullscreen 
            ? `width: 100vw; height: ${fullscreenHeight()}; transform: none;` 
            : dockConfig.isDocked 
                ? `width: ${dockConfig.dockedWidth}vw; height: ${dockedHeight()}; right: 0; bottom: 0; transform: none;` 
                : `right: ${currentRight}px; bottom: ${currentBottom}px; width: ${currentWidth}px; height: ${currentHeight}px; transform: none;`}"
		transition:fly={{ 
			duration: 300, 
			y: 100, 
			opacity: 0, 
			easing: quintOut 
		}}
		role="dialog"
		aria-label="AI Assistant"
	>
		<!-- Divider for docked mode -->
		{#if dockConfig.isDocked && !fullscreenConfig.isFullscreen}
			<div 
				class="divider"
				class:dragging={isDraggingDivider}
				onmousedown={handleDividerDragStart}
				role="separator"
				aria-label="Resize docked assistant"
			>
				<div class="divider-handle"></div>
			</div>
		{/if}

		<!-- Resize Handle -->
		{#if !dockConfig.isDocked && !fullscreenConfig.isFullscreen}
			<div 
				class="resize-handle"
				onmousedown={handleResizeStart}
				role="separator"
				aria-label="Resize assistant window"
			>
				<!-- <svg width="30" height="30" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 0 L20 0 L0 20 Z" />
				</svg> -->
			</div>
		{/if}

		<div 
			class="assistant-header"
			onmousedown={fullscreenConfig.isFullscreen ? undefined : handleDragStart}
		>
			<div class="header-controls">

				<button
					class="icon-button maximize-button"
					class:active={fullscreenConfig.isFullscreen}
					onclick={handleFullscreen}
					aria-label="{fullscreenConfig.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} assistant"
					title="{fullscreenConfig.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}"
				>
					<i class="fa-solid fa-up-right-and-down-left-from-center"></i>
				</button>
				<button
					class="icon-button pin-button"
					class:active={dockConfig.isDocked}
					onclick={handlePin}
					aria-label="{dockConfig.isDocked ? 'Unpin' : 'Pin'} assistant"
					title="{dockConfig.isDocked ? 'Unpin window' : 'Pin window'}"
				>
					<i class="fa-solid fa-thumbtack"></i>
				</button>				
				<button
					class="icon-button minimize-button"
					onclick={handleClose}
					aria-label="Minimize assistant"
					title="Minimize"
				>
					<i class="fa-solid fa-minus"></i>
				</button>
			</div>
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
		/* bottom: 12rem;
		right: 12rem; */
		width: 500px;
		max-width: 100vw;
		height: 800px;
		max-height: 100vh;
		border-radius: 3.5rem;
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

	.assistant-box.dragging {
		cursor: grabbing;
		user-select: none;
	}

	.assistant-box.resizing {
		user-select: none;
	}

	.assistant-box.docked {
		position: fixed;
		right: 0;
		bottom: 0;
		width: 25vw;
		height: 100vh;
		border-radius: 0;
		transform: none !important;
		box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
		border-left: 1px solid rgba(255, 255, 255, 0.1);
		cursor: default;
	}

	:global(.light) .assistant-box.docked {
		box-shadow: -4px 0 12px rgba(0, 0, 0, 0.05);
		border-left: 1px solid rgba(0, 0, 0, 0.1);
	}

	.assistant-box.docked .assistant-header {
		cursor: default;
		border-radius: 0;
	}

	.assistant-box.fullscreen {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		height: 100vh; /* override the height from the target element */
		width: 100vw !important;
		border-radius: 0;
		transform: none !important;
		box-shadow: none;
		z-index: 10000; /* Highest z-index for fullscreen */
	}

	.assistant-box.fullscreen .assistant-header {
		cursor: default;
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

	.resize-handle {
		position: absolute;
		top: 0;
		left: 0;
		width: 5rem;
		height: 5rem;
		cursor: nw-resize;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		color: rgba(255, 255, 255, 0.3);
		z-index: 1;
		padding: 0;
		border-radius: 2.5rem 0 0 0;
		overflow: hidden;
		transition: color 0.2s ease;
	}

	.resize-handle svg {
		position: absolute;
		top: 0;
		left: 0;
	}

	:global(.light) .resize-handle {
		color: rgba(0, 0, 0, 0.3);
	}

	.resize-handle:hover {
		color: rgba(255, 255, 255, 0.5);
	}

	:global(.light) .resize-handle:hover {
		color: rgba(0, 0, 0, 0.5);
	}

	.assistant-header {
		padding: 2rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		cursor: grab;
		user-select: none;
	}

	.assistant-header:active {
		cursor: grabbing;
	}

	:global(.light) .assistant-header {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.header-controls {
		display: flex;
		gap: 0rem;
		align-items: center;
	}

	.icon-button {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 0.625rem;
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1.5rem;
		position: relative;
		outline: none;
	}

	:global(.light) .icon-button {
		color: rgba(0, 0, 0, 0.6);
	}

	.icon-button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
	}

	:global(.light) .icon-button:hover {
		background: rgba(0, 0, 0, 0.08);
		color: rgba(0, 0, 0, 0.8);
	}

	.icon-button:active {
		transform: scale(0.95);
	}

	.icon-button.active {
		background: rgba(255, 255, 255, 0.15);
		color: var(--sk-fg-accent);
	}

	:global(.light) .icon-button.active {
		background: rgba(0, 0, 0, 0.1);
		color: var(--sk-fg-accent);
	}

	/* Rotate pin icon when docked */
	.pin-button.active i {
		transform: rotate(45deg);
		transition: transform 0.2s ease;
	}

	/* Remove old styles */
	.drag-indicator {
		display: none;
	}

	.close-button {
		display: none;
	}

	/* Divider styles */
	.divider {
		position: absolute;
		left: -4px;
		top: 0;
		bottom: 0;
		width: 8px;
		cursor: ew-resize;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s ease;
	}

	.divider:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	:global(.light) .divider:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.divider.dragging {
		background: rgba(255, 255, 255, 0.1);
	}

	:global(.light) .divider.dragging {
		background: rgba(0, 0, 0, 0.1);
	}

	.divider-handle {
		width: 2px;
		height: 48px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 1px;
		transition: all 0.2s ease;
	}

	:global(.light) .divider-handle {
		background: rgba(0, 0, 0, 0.3);
	}

	.divider:hover .divider-handle,
	.divider.dragging .divider-handle {
		height: 64px;
		background: rgba(255, 255, 255, 0.5);
	}

	:global(.light) .divider:hover .divider-handle,
	:global(.light) .divider.dragging .divider-handle {
		background: rgba(0, 0, 0, 0.5);
	}

	/* Disable body selection while dragging */
	:global(body:has(.divider.dragging)) {
		user-select: none;
		cursor: ew-resize;
	}

	.assistant-content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}

	/* Mobile responsiveness - disable drag/resize on mobile */
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
			bottom: 0 !important;
			right: 0 !important;
			left: 0;
			width: 100% !important;
			max-width: 100%;
			height: 80vh !important;
			max-height: 100vh;
			border-radius: 1rem 1rem 0 0;
			transform: none !important;
		}

		.resize-handle {
			display: none;
		}

		.assistant-header {
			cursor: default;
		}
	}
</style> 