import type { BlockGroup } from './types';
interface Props {
    results: BlockGroup[];
    query: string;
    onselect?: (href: string) => void;
}
declare const SearchResultList: import("svelte").Component<Props, {}, "">;
type SearchResultList = ReturnType<typeof SearchResultList>;
export default SearchResultList;
