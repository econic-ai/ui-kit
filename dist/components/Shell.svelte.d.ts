import '../styles/index.sass';
import type { Snippet } from 'svelte';
type $$ComponentProps = {
    nav_visible?: boolean;
    top_nav?: Snippet;
    children?: Snippet;
    banner?: Snippet;
    footer?: Snippet;
};
/** The main shell of the application. It provides a slot for the top navigation, the main content, and the bottom banner. */
declare const Shell: import("svelte").Component<$$ComponentProps, {}, "">;
type Shell = ReturnType<typeof Shell>;
export default Shell;
