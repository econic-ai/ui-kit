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
    const isMinimized = $derived(assistant.minimized);
    const mode = $derived(assistant.mode);
    const navSelected = $derived(assistant.navSelected);
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
    let dragBoxWidth = $state(0);
    let dragBoxHeight = $state(0);
    // Position stored as offsets from right and bottom
    let currentRight = $state(initialOffsets.right);
    let currentBottom = $state(initialOffsets.bottom);

    // UI state derived from store
    const floatingOpen = $derived(isOpen && mode === 'floating');

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

		const minWidth = floatingOpen ? 300 : 0;
		const minHeight = floatingOpen ? 400 : 0;

		// 1) Compute max size permitted by current offsets (to keep top/left >= 0)
		const maxWidthByOffsets = Math.max(0, window.innerWidth - currentRight);
		const maxHeightByOffsets = Math.max(0, window.innerHeight - currentBottom);

		// 2) Clamp size to fit within viewport using current offsets
		let nextWidth = Math.min(currentWidth, maxWidthByOffsets);
		let nextHeight = Math.min(currentHeight, maxHeightByOffsets);

		// 3) Enforce minimums (only when fully open floating); if the viewport cannot accommodate min width/height at current offsets,
		//    reduce the offsets so the assistant still fits while anchored bottom-right
		if (minWidth > 0 && nextWidth < minWidth) {
			nextWidth = Math.min(minWidth, window.innerWidth); // never exceed viewport width
			currentRight = Math.max(0, window.innerWidth - nextWidth);
		}
		if (minHeight > 0 && nextHeight < minHeight) {
			nextHeight = Math.min(minHeight, window.innerHeight); // never exceed viewport height
			currentBottom = Math.max(0, window.innerHeight - nextHeight);
		}

		currentWidth = nextWidth;
		currentHeight = nextHeight;

		// 4) Finally, ensure offsets themselves are within bounds for the new size
		const maxRight = Math.max(0, window.innerWidth - currentWidth);
		const maxBottom = Math.max(0, window.innerHeight - currentHeight);
		currentRight = Math.min(currentRight, maxRight);
		currentBottom = Math.min(currentBottom, maxBottom);
		// Persist clamped values so localStorage reflects the latest
		if (floatingOpen) assistant.setSize(currentWidth, currentHeight);
		assistant.setOffsets(currentRight, currentBottom);
    }

    function handleToggleMinimize() {
        // if (dockConfig.isDocked || fullscreenConfig.isFullscreen) return;
        // Minimizing should close the assistant (enter closed state)
        assistant.close();
        assistant.setMinimized(false);
		assistant.setDocked(false)
        console.debug('[Assistant] minimize -> closed');
    }

    $effect(() => {
        console.debug('[Assistant] state', { isOpen, isMinimized, docked: dockConfig.isDocked, fullscreen: fullscreenConfig.isFullscreen });
    });

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
        // determine the actual rendered box size for drag calculations
        const effectiveWidth = floatingOpen
            ? currentWidth
            : (!isOpen ? 50 : (isMinimized ? 200 : currentWidth));
        const effectiveHeight = floatingOpen
            ? currentHeight
            : (!isOpen ? 50 : (isMinimized ? 100 : currentHeight));
        dragBoxWidth = effectiveWidth;
        dragBoxHeight = effectiveHeight;
        // compute current left/top from right/bottom offsets
        const currentLeft = window.innerWidth - currentRight - effectiveWidth;
        const currentTop = window.innerHeight - currentBottom - effectiveHeight;
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
        currentRight = Math.max(0, window.innerWidth - newLeft - dragBoxWidth);
        currentBottom = Math.max(0, window.innerHeight - newTop - dragBoxHeight);
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

	// UI event helpers to avoid inline multi-statement handlers
	function handleGlobalKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && (e.key === 'o' || e.key === 'O')) {
			e.preventDefault();
			assistant.openToDefault();
			console.debug('[Assistant] openToDefault via Cmd/Ctrl+O (global)');
		}
	}

	function handleContainerClick() {
		if (isDragging) return;
		if (!isOpen) {
			assistant.open();
			assistant.setMinimized(true);
			console.debug('[Assistant] box click: opening to open-minimized');
			return;
		}
		if (isMinimized) {
			assistant.setMinimized(false);
			console.debug('[Assistant] box click: restoring from minimized');
		}
	}

	function handleMaximizeButtonClick(e: MouseEvent) {
		e.stopPropagation();
		handleFullscreen();
	}

	function handlePinButtonClick(e: MouseEvent) {
		e.stopPropagation();
		handlePin();
	}

	function handleMinimizeButtonClick(e: MouseEvent) {
		e.stopPropagation();
		handleToggleMinimize();
	}

</script>

<svelte:window onkeydown={handleGlobalKeydown} on:resize={clampToViewport} />

<!-- Single Assistant Box handles all states (closed/hover/min/open/docked/fullscreen) -->

<!-- Assistant Box -->
<div
    bind:this={assistantBox}
    class="assistant-box"
    class:closed={!isOpen}
    class:minimized={isOpen && !dockConfig.isDocked && !fullscreenConfig.isFullscreen && isMinimized}
    class:dragging={isDragging}
    class:resizing={isResizing}
    class:docked={dockConfig.isDocked}
    class:fullscreen={fullscreenConfig.isFullscreen}
    style="{fullscreenConfig.isFullscreen 
        ? `width: 100vw; height: ${fullscreenHeight()}; right: 0; bottom: 0; transform: none;` 
        : dockConfig.isDocked 
            ? `width: ${dockConfig.dockedWidth}vw; height: ${dockedHeight()}; right: 0; bottom: 0; transform: none;` 
            : floatingOpen 
                ? `right: ${currentRight}px; bottom: ${currentBottom}px; width: ${currentWidth}px; height: ${currentHeight}px; transform: none;`
                : isMinimized && isOpen
                    ? `right: ${currentRight}px; bottom: ${currentBottom}px; width: ${currentWidth}px; transform: none;`
                    : `right: ${currentRight}px; bottom: ${currentBottom}px; transform: none;`}"
    transition:fly={{ 
        duration: 300, 
        y: 100, 
        opacity: 0, 
        easing: quintOut 
    }}
    role="dialog"
    aria-label="AI Assistant"
    tabindex="0"
    onkeydown={handleGlobalKeydown}
    onmousedown={!floatingOpen ? handleDragStart : undefined}
    onclick={handleContainerClick}
>
        <!-- Left Handle (drag) -->
        <div class="handle-left" 
            onmousedown={(e) => { e.stopPropagation(); handleDragStart(e); }} 
            onclick={(e) => e.stopPropagation()}
            aria-label="Drag Omnibar">
            <i class="fa-solid fa-grip"></i>
        </div>

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
        {#if floatingOpen}
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
        <div class="assistant-content" hidden={!floatingOpen && !dockConfig.isDocked && !fullscreenConfig.isFullscreen}>
			<!-- Content will be added in future steps -->
		</div>

                 <!-- Title Row -->
		 <div class="bar-wrapper">
			<div class="bar" class:open={isOpen}>
				<div class="bar-align top">
					<div class="title-row">
						<span class="title">Omnibar</span>
						<span class="shortcut-pill">⌘O</span>
						{#if isOpen}
							<input 
								type="text" 
								class="omnibar-input"
								placeholder="Type to search..."
								onclick={(e) => e.stopPropagation()}
								onmousedown={(e) => e.stopPropagation()}
							/>
						{/if}
					</div>
				</div>

				<!-- Bottom-right controls (absolute) -->
				<div class="bar-align bottom"
					class:closed={!isOpen}
					class:hover={!isOpen}
					>
					<div class="controls-bottom-right">

						<div class="chat-icons">
							<button aria-label="Add"><i class="fa-light fa-plus"></i></button>
							<button aria-label="Image"><i class="fa-light fa-camera"></i></button>
							<button aria-label="Voice"><i class="fa-light fa-microphone-lines"></i></button>
						</div>
						
						<div class="controls-divider" aria-hidden="true"></div>

						<div class="nav-icons">
							<button class:active={navSelected==='home'} onclick={() => assistant.setNavSelected('home')} aria-label="Home"><i class="fa-solid fa-house"></i></button>
							<button class:active={navSelected==='people'} onclick={() => assistant.setNavSelected('people')} aria-label="People"><i class="fa-solid fa-user-group"></i></button>
							<button class:active={navSelected==='search'} onclick={() => assistant.setNavSelected('search')} aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
							<button class:active={navSelected==='calls'} onclick={() => assistant.setNavSelected('calls')} aria-label="Calls"><i class="fa-solid fa-phone"></i></button>
						</div>
						
					</div>
				</div>
			</div>
        </div>

        <!-- Top-right actions (absolute) -->
        <div class="top-right-actions">
            <button onclick={(e) => { e.stopPropagation(); assistant.close(); assistant.setMinimized(false); }} aria-label="Close"><i class="fa-solid fa-ellipsis"></i></button>
            <button onclick={(e) => { e.stopPropagation(); assistant.toggleFullscreen(); }} aria-label="Fullscreen"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></button>
            <button onclick={(e) => { e.stopPropagation(); assistant.toggleDocked(); }} aria-label="Dock"><i class="fa-solid fa-arrow-right-to-bracket"></i></button>
        </div>

    </div>

<style>

.assistant-box {
	position: fixed;
	/* bottom: 12rem;
	right: 12rem; */
	/* width: 500px; */
	max-width: 100vw;
	/* height: 800px; */
	max-height: 100vh;
	border-radius: 42px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	z-index: 9999;
	display: flex;
	flex-direction: column;
	
	/* Dark theme gradient - subtle dark to darker */
	/* background: linear-gradient(135deg, 
		rgba(0, 0, 0, 0.45) 0%, 
		rgba(0, 0, 0, 0.95) 100%
	); */
	background: var(--sk-bg-2);

	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	/* border: 1px solid rgba(255, 255, 255, 0.1); */
	
	/* Add transition for all properties */
	transition: width 200ms ease, height 200ms ease, border-radius 200ms ease;
}

.assistant-box.closed {
    /* height: 50px; */
    /* border-radius: 999px; */
    transition: width 2s ease, height 2s ease;
}

/* .assistant-box.closed:hover {
    width: 100px;
} */

.assistant-box.minimized {
    height: 150px;
    transition: width 1s ease, height 1s ease;
}

	.bar-align {
		display: flex;
		flex-direction: column;

		&.top {
			justify-content: flex-start;
			align-items: flex-start;
		}

		&.bottom {
			justify-content: flex-end;
			align-items: flex-end!important;
			overflow: hidden;
			transition: width 1s ease, opacity 1s ease;
			width: 100%;
			opacity: 1;

			&.closed {
				opacity: 0;
				width: 0;
			}
			
			.bar.open & {
				align-items: flex-start;
			}
		}
	}
    .assistant-box.dragging {
		cursor: grabbing;
		user-select: none;
	}
    /* Omnibar content */
	.bar-wrapper { height: 100%; overflow: hidden; max-height: 150px; }
    .bar { 
		justify-content: space-between; 
		height: 100%; 
		position: relative; 
		display: flex; 
		align-items: center; 
		padding: 2rem 2rem 2rem 3rem; 
		transition: padding-right 200ms ease;
		
		&.open {
			flex-direction: column;
			align-items: stretch;
			justify-content: space-between;
		}
	}
    .title-row { 
		display: flex; 
		align-items: center; 
		gap: 0.75rem; 
		height: 50px;
		width: 100%;
	}
    .title { font-weight: 500; letter-spacing: 0.5px; opacity: 0.9; font-size: 1.8rem; flex-shrink: 0; }
    .shortcut-pill { font-weight: 500; opacity: 1; background: var(--sk-bg-1); padding: 1.2rem 1.2rem; border-radius: 0.5rem; font-size: 1.25rem; flex-shrink: 0; }
	
	.omnibar-input {
		flex: 1;
		background: var(--sk-bg-1);
		border: none;
		outline: none;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 1.25rem;
		color: var(--sk-fg-1);
		min-width: 0;
		height: 40px;
		
		&::placeholder {
			color: var(--sk-fg-3);
			opacity: 0.7;
		}
		
		&:focus {
			background: var(--sk-bg-1);
		}
	}

    .controls-bottom-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 2.5rem;
		padding-right: 0px;
		opacity: 1;
		transition: opacity 200ms ease, transform 200ms ease;
		/* margin-left: -30rem; */
	}
    .nav-icons { display: inline-flex;}
    .nav-icons button { 
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: transparent;
		border: 0;
		margin: 0;
		padding: 0;
		border-radius: 5px;
		transition: background 200ms ease;

		i {
			font-size: 1.75rem;
		}
	}
    .nav-icons button.active, .nav-icons button:hover { background: var(--sk-bg-4); }
    .controls-divider { width: 1px; height: 22px; background: var(--sk-fg-4); opacity: 0.5; margin: 0 0.75rem; }
    .chat-icons { display: inline-flex; }
    .chat-icons button { 
		display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 0; background: transparent; color: var(--sk-fg-3);
		transition: color 200ms ease;

		i {
			font-size: 1.5rem;
		}
	}
    .chat-icons button:hover { color: var(--sk-fg-1); }

    /* Hover/minimized reveal */
    /* .assistant-box.closed .bar { padding-right: 0.75rem; } */
    /* .assistant-box.closed:hover .bar { padding-right: 12rem; } */
    
    /* Show bottom bar on hover when closed */
    .assistant-box.closed:hover .bar-align.bottom {
        opacity: 1;
        width: 100%;
    }
    
    .assistant-box.closed:hover .controls-bottom-right { 
		opacity: 1;
		transform: translateY(0);

	}
    .assistant-box.minimized .controls-bottom-right { opacity: 1; transform: translateY(0); }

    /* Absolute adornments */
    .handle-left { position: absolute; left: 0; top: 50%; transform: translate(-50%, -50%); background: var(--sk-bg-4); width: 25px; height: 32px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; cursor: grab; }
    .top-right-actions { position: absolute; right: 0; top: 0; transform: translate(0%, -50%); display: inline-flex; gap: 0; border-radius: 8px; background: var(--sk-bg-4); }
    .top-right-actions button { width: 25px; height: 25px; border: 0; display: inline-flex; align-items: center; justify-content: center; }

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
		/* padding: 1.5rem; */
		overflow-y: auto;
	}

	/* Mobile responsiveness - disable drag/resize on mobile */
	@media (max-width: 640px) {


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