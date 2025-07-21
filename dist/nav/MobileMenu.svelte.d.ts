import type { NavigationLink } from '../types';
interface Props {
    links: NavigationLink[];
    current: NavigationLink | undefined;
    onclose: () => void;
    user?: any;
    session?: {
        user?: any;
    } | null;
}
declare const MobileMenu: import("svelte").Component<Props, {}, "">;
type MobileMenu = ReturnType<typeof MobileMenu>;
export default MobileMenu;
