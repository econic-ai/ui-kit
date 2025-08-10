import { Persisted } from './Persisted.svelte';

interface AssistantOffsets {
    right: number;
    bottom: number;
}

interface AssistantSize {
	width: number;
	height: number;
}

interface DockConfig {
	isDocked: boolean;
	dockedWidth: number; // percentage of viewport width
}

interface FullscreenConfig {
	isFullscreen: boolean;
}

class AssistantState {
	#isOpen = new Persisted<'true' | 'false'>('sv:assistant-open', 'false');
    #position = new Persisted<string>('sv:assistant-position', JSON.stringify({ right: 192, bottom: 192 }));
	#size = new Persisted<string>('sv:assistant-size', JSON.stringify({ width: 500, height: 800 }));
	#dockConfig = new Persisted<string>('sv:assistant-dock', JSON.stringify({ isDocked: false, dockedWidth: 25 }));
	#fullscreenConfig = new Persisted<string>('sv:assistant-fullscreen', JSON.stringify({ isFullscreen: false }));

	// Make isOpen reactive with $derived
	isOpen = $derived(this.#isOpen.current === 'true');

    // Offsets and size as reactive derived values
    offsets = $derived(JSON.parse(this.#position.current) as AssistantOffsets);
	size = $derived(JSON.parse(this.#size.current) as AssistantSize);
	dockConfig = $derived(JSON.parse(this.#dockConfig.current) as DockConfig);
	fullscreenConfig = $derived(JSON.parse(this.#fullscreenConfig.current) as FullscreenConfig);

	toggle() {
		this.#isOpen.current = this.#isOpen.current === 'true' ? 'false' : 'true';
	}

	open() {
		this.#isOpen.current = 'true';
	}

	close() {
		this.#isOpen.current = 'false';
	}

    setOffsets(right: number, bottom: number) {
        this.#position.current = JSON.stringify({ right, bottom });
    }

	setSize(width: number, height: number) {
		this.#size.current = JSON.stringify({ width, height });
	}

    resetOffsets() {
        this.#position.current = JSON.stringify({ right: 192, bottom: 192 });
	}

	resetSize() {
		this.#size.current = JSON.stringify({ width: 500, height: 800 });
	}

	toggleDocked() {
		const current = JSON.parse(this.#dockConfig.current) as DockConfig;
		this.#dockConfig.current = JSON.stringify({ ...current, isDocked: !current.isDocked });
	}

	setDocked(isDocked: boolean) {
		const current = JSON.parse(this.#dockConfig.current) as DockConfig;
		this.#dockConfig.current = JSON.stringify({ ...current, isDocked });
	}

	setDockedWidth(width: number) {
		const current = JSON.parse(this.#dockConfig.current) as DockConfig;
		this.#dockConfig.current = JSON.stringify({ ...current, dockedWidth: width });
	}

	toggleFullscreen() {
		const current = JSON.parse(this.#fullscreenConfig.current) as FullscreenConfig;
		this.#fullscreenConfig.current = JSON.stringify({ ...current, isFullscreen: !current.isFullscreen });
	}

	setFullscreen(isFullscreen: boolean) {
		const current = JSON.parse(this.#fullscreenConfig.current) as FullscreenConfig;
		this.#fullscreenConfig.current = JSON.stringify({ ...current, isFullscreen });
	}
}

export const assistant = new AssistantState(); 