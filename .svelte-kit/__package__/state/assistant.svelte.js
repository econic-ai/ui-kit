import { Persisted } from './Persisted.svelte';
class AssistantState {
    #isOpen = new Persisted('sv:assistant-open', 'false');
    #position = new Persisted('sv:assistant-position', JSON.stringify({ right: 192, bottom: 192 }));
    #size = new Persisted('sv:assistant-size', JSON.stringify({ width: 500, height: 800 }));
    #dockWidth = new Persisted('sv:assistant-dock', '25');
    #navSelected = new Persisted('sv:assistant-nav-selected', '');
    #lastOpen = new Persisted('sv:assistant-last-open', 'minimized');
    #mode = new Persisted('sv:assistant-mode', 'minimized');
    // Make isOpen reactive with $derived
    isOpen = $derived(this.#isOpen.current === 'true');
    minimized = $derived(this.#mode.current === 'minimized');
    // Offsets and size as reactive derived values
    offsets = $derived(JSON.parse(this.#position.current));
    size = $derived(JSON.parse(this.#size.current));
    dockConfig = $derived({ isDocked: this.#mode.current === 'docked', dockedWidth: Number(this.#dockWidth.current) || 25 });
    fullscreenConfig = $derived({ isFullscreen: this.#mode.current === 'fullscreen' });
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
    toggleMinimized() { this.setMode(this.#mode.current !== 'minimized' ? 'minimized' : 'floating'); }
    setMinimized(v) { this.setMode(v ? 'minimized' : 'floating'); }
    setOffsets(right, bottom) {
        this.#position.current = JSON.stringify({ right, bottom });
    }
    setSize(width, height) {
        this.#size.current = JSON.stringify({ width, height });
    }
    resetOffsets() {
        this.#position.current = JSON.stringify({ right: 192, bottom: 192 });
    }
    resetSize() {
        this.#size.current = JSON.stringify({ width: 500, height: 800 });
    }
    toggleDocked() { this.setMode(this.#mode.current !== 'docked' ? 'docked' : 'floating'); }
    setDocked(isDocked) { this.setMode(isDocked ? 'docked' : 'floating'); }
    setDockedWidth(width) { this.#dockWidth.current = String(width); }
    toggleFullscreen() { this.setMode(this.#mode.current !== 'fullscreen' ? 'fullscreen' : 'floating'); }
    setFullscreen(isFullscreen) { this.setMode(isFullscreen ? 'fullscreen' : 'floating'); }
    setNavSelected(key) { this.#navSelected.current = key; }
    openToDefault() {
        this.#isOpen.current = 'true';
        const def = this.#lastOpen.current || 'minimized';
        this.setMode(def);
        this.#lastOpen.current = def;
    }
    #updateLastOpenStateFromCurrent() {
        const state = this.#mode.current;
        this.#lastOpen.current = state;
    }
    setMode(next) {
        // persist canonical mode
        this.#mode.current = next;
        // legacy flags removed; derive at runtime only
        if (this.#isOpen.current === 'true')
            this.#updateLastOpenStateFromCurrent();
    }
}
export const assistant = new AssistantState();
