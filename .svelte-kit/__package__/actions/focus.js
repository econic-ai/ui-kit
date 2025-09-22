import { tick } from 'svelte';
/** Sometimes the autofocus attribute is insufficient, we need to do this */
export function forcefocus(node) {
    tick().then(() => node.focus());
}
export function focusable_children(node) {
    const nodes = Array.from(
    // this rather intimating selector selects elements that aren't children of closed <details> elements,
    // except for the <summary> elements that are their direct children
    node.querySelectorAll(':where(a[href], button, input, textarea, select, summary, [tabindex]:not([tabindex="-1"])):not(details:not([open]) *), summary:not(details:not([open]) details *)'));
    const index = nodes.indexOf(document.activeElement);
    const update = (d) => {
        let i = index + d;
        i += nodes.length;
        i %= nodes.length;
        nodes[i].focus();
    };
    function traverse(d, selector) {
        const reordered = [...nodes.slice(index), ...nodes.slice(0, index)];
        let i = (reordered.length + d) % reordered.length;
        let node;
        while ((node = reordered[i])) {
            i += d;
            if (!selector || node.matches(selector)) {
                node.focus();
                return;
            }
        }
    }
    return {
        next: (selector) => traverse(1, selector),
        prev: (selector) => traverse(-1, selector),
        update
    };
}
export function trap(node, { reset_focus = true } = {}) {
    const previous = document.activeElement;
    const handle_keydown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const group = focusable_children(node);
            if (e.shiftKey) {
                group.prev();
            }
            else {
                group.next();
            }
        }
    };
    node.addEventListener('keydown', handle_keydown);
    return {
        destroy: () => {
            node.removeEventListener('keydown', handle_keydown);
            if (reset_focus) {
                previous?.focus({ preventScroll: true });
            }
        }
    };
}
