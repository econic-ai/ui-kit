import '../styles/index.sass';
/** The main shell of the application. It provides a slot for the top navigation, the main content, and the bottom banner. */
declare const Shell: import("svelte").Component<{
    nav_visible?: boolean;
    top_nav: any;
    children: any;
    footer?: Function;
}, {}, "">;
type Shell = ReturnType<typeof Shell>;
export default Shell;
