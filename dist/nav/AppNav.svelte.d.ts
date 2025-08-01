declare const AppNav: import("svelte").Component<{
    links: any;
    session: any;
    user: any;
    appMountPoint?: string;
    webMountPoint?: string;
    isLoggedIn?: boolean;
}, {}, "">;
type AppNav = ReturnType<typeof AppNav>;
export default AppNav;
