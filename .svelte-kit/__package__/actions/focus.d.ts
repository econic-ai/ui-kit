/** Sometimes the autofocus attribute is insufficient, we need to do this */
export declare function forcefocus(node: HTMLInputElement): void;
export declare function focusable_children(node: HTMLElement): {
    next: (selector?: string) => void;
    prev: (selector?: string) => void;
    update: (d: number) => void;
};
export declare function trap(node: HTMLElement, { reset_focus }?: {
    reset_focus?: boolean;
}): {
    destroy: () => void;
};
