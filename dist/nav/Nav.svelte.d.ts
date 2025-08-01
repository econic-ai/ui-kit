declare const Nav: import("svelte").Component<{
    home_title?: string;
    title: any;
    links: any;
    session: any;
    user: any;
    appMountPoint?: string;
    webMountPoint?: string;
    isLoggedIn?: boolean;
    in_app?: boolean;
}, {}, "">;
type Nav = ReturnType<typeof Nav>;
export default Nav;
