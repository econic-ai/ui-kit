declare const Nav: import("svelte").Component<{
    home_title?: string;
    title: any;
    links: any;
    session: any;
    user: any;
}, {}, "">;
type Nav = ReturnType<typeof Nav>;
export default Nav;
