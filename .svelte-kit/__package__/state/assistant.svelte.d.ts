type AssistantMode = 'minimized' | 'floating' | 'docked' | 'fullscreen';
declare class AssistantState {
    #private;
    isOpen: boolean;
    minimized: boolean;
    offsets: any;
    size: any;
    dockConfig: {
        isDocked: boolean;
        dockedWidth: number;
    };
    fullscreenConfig: {
        isFullscreen: boolean;
    };
    lastOpenState: string;
    mode: string;
    navSelected: string;
    toggle(): void;
    open(): void;
    close(): void;
    toggleMinimized(): void;
    setMinimized(v: boolean): void;
    setOffsets(right: number, bottom: number): void;
    setSize(width: number, height: number): void;
    resetOffsets(): void;
    resetSize(): void;
    toggleDocked(): void;
    setDocked(isDocked: boolean): void;
    setDockedWidth(width: number): void;
    toggleFullscreen(): void;
    setFullscreen(isFullscreen: boolean): void;
    setNavSelected(key: string): void;
    openToDefault(): void;
    setMode(next: AssistantMode): void;
}
export declare const assistant: AssistantState;
export {};
