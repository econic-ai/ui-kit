import type { Snippet } from 'svelte';
import type { BlockGroup } from './types';
interface Props {
    results: BlockGroup[];
    query: string;
    onselect?: (href: string) => void;
    children?: Snippet;
}
/** Renders a list of search results */
declare const SearchResults: import("svelte").Component<Props, {}, "">;
type SearchResults = ReturnType<typeof SearchResults>;
export default SearchResults;
