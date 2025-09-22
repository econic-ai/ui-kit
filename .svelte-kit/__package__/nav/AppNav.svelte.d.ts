declare const AppNav: import("svelte").Component<{
    links: any;
    user: any;
    appMountPoint?: string;
    webMountPoint?: string;
}, {}, "">;
type AppNav = ReturnType<typeof AppNav>;
export default AppNav;
