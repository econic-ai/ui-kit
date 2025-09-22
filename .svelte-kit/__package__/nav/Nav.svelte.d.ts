declare const Nav: import("svelte").Component<{
    home_title?: string;
    title?: string;
    links: any;
    user: any;
    appMountPoint?: string;
    webMountPoint?: string;
}, {}, "">;
type Nav = ReturnType<typeof Nav>;
export default Nav;
