import type { NavigationLink } from '../types';
interface Props {
    home_title?: string;
    title: string | undefined;
    links: NavigationLink[];
    session?: {
        user?: any;
    } | null;
    user?: any;
}
declare const Nav: import("svelte").Component<Props, {}, "">;
type Nav = ReturnType<typeof Nav>;
export default Nav;
