import { Persisted } from './Persisted.svelte';

// interface AssistantOffsets {
//     right: number;
//     bottom: number;
// }

// interface AssistantSize {
// 	width: number;
// 	height: number;
// }

// interface DockConfig {
// 	isDocked: boolean;
// 	dockedWidth: number; // percentage of viewport width
// }

// interface FullscreenConfig {
// 	isFullscreen: boolean;
// }

type AssistantMode = 'minimized' | 'floating' | 'docked' | 'fullscreen';
type AssistantDefaultOpen = 'minimized' | 'floating' | 'docked' | 'fullscreen';

export class AssistantState {
    #isOpen = new Persisted<'true' | 'false'>('sv:assistant-open', 'false');
    #position = new Persisted<string>('sv:assistant-position', JSON.stringify({ right: 192, bottom: 192 }));
    #size = new Persisted<string>('sv:assistant-size', JSON.stringify({ width: 500, height: 800 }));
    #dockWidth = new Persisted<string>('sv:assistant-dock', '25');
    #navSelected = new Persisted<string>('sv:assistant-nav-selected', '');
    #lastOpen = new Persisted<string>('sv:assistant-last-open', 'minimized');
    #mode = new Persisted<string>('sv:assistant-mode', 'minimized');

	// Make isOpen reactive with $derived
	isOpen = $derived(this.#isOpen.current === 'true');
    minimized = $derived((this.#mode.current as AssistantMode) === 'minimized');

    // Offsets and size as reactive derived values
    offsets = $derived(JSON.parse(this.#position.current));
	size = $derived(JSON.parse(this.#size.current));
    dockConfig = $derived({ isDocked: (this.#mode.current as AssistantMode) === 'docked', dockedWidth: Number(this.#dockWidth.current) || 25 });
    fullscreenConfig = $derived({ isFullscreen: (this.#mode.current as AssistantMode) === 'fullscreen' });
    lastOpenState = $derived(this.#lastOpen.current);
    mode = $derived(this.#mode.current);
    navSelected = $derived(this.#navSelected.current);

	toggle() {
		this.#isOpen.current = this.#isOpen.current === 'true' ? 'false' : 'true';
	}

	open() {
		this.#isOpen.current = 'true';
        this.#updateLastOpenStateFromCurrent();
	}

	close() {
		this.#isOpen.current = 'false';
	}

    toggleMinimized() { this.setMode((this.#mode.current as AssistantMode) !== 'minimized' ? 'minimized' : 'floating'); }
    setMinimized(v: boolean) { this.setMode(v ? 'minimized' : 'floating'); }

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

    toggleDocked() { this.setMode((this.#mode.current as AssistantMode) !== 'docked' ? 'docked' : 'floating'); }

    setDocked(isDocked: boolean) { this.setMode(isDocked ? 'docked' : 'floating'); }

    setDockedWidth(width: number) { this.#dockWidth.current = String(width); }

    toggleFullscreen() { this.setMode((this.#mode.current as AssistantMode) !== 'fullscreen' ? 'fullscreen' : 'floating'); }

    setFullscreen(isFullscreen: boolean) { this.setMode(isFullscreen ? 'fullscreen' : 'floating'); }

    setNavSelected(key: string) { this.#navSelected.current = key; }

    openToDefault() {
        this.#isOpen.current = 'true';
        const def = (this.#lastOpen.current as AssistantDefaultOpen) || 'minimized';
        this.setMode(def as AssistantMode);
        this.#lastOpen.current = def;
    }

    #updateLastOpenStateFromCurrent() {
        const state = this.#mode.current as AssistantDefaultOpen;
        this.#lastOpen.current = state;
    }

    setMode(next: AssistantMode) {
        // persist canonical mode
        this.#mode.current = next;

        // legacy flags removed; derive at runtime only
        if (this.#isOpen.current === 'true') this.#updateLastOpenStateFromCurrent();
    }
}

export const assistant = new AssistantState(); 