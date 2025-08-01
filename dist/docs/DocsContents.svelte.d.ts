import type { Document } from '../types';
interface Props {
    contents: Document[];
    show_ts_toggle?: boolean;
}
declare const DocsContents: import("svelte").Component<Props, {}, "">;
type DocsContents = ReturnType<typeof DocsContents>;
export default DocsContents;
