declare const AppNavDropDown: import("svelte").Component<{
    user: any;
    session: any;
    visible?: boolean;
    appMountPoint?: string;
    webMountPoint?: string;
}, {}, "">;
type AppNavDropDown = ReturnType<typeof AppNavDropDown>;
export default AppNavDropDown;
