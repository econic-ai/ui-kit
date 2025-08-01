import type { NavigationLink } from '../types';
type $$ComponentProps = {
    title: string;
    contents: NavigationLink['sections'];
};
declare const MobileSubMenu: import("svelte").Component<$$ComponentProps, {
    scrollToActive: () => Promise<void>;
}, "">;
type MobileSubMenu = ReturnType<typeof MobileSubMenu>;
export default MobileSubMenu;
