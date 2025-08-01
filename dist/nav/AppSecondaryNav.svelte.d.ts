declare const AppSecondaryNav: import("svelte").Component<{
    user: any;
    session: any;
    appMountPoint?: string;
    webMountPoint?: string;
    isLoggedIn?: boolean;
}, {}, "">;
type AppSecondaryNav = ReturnType<typeof AppSecondaryNav>;
export default AppSecondaryNav;
