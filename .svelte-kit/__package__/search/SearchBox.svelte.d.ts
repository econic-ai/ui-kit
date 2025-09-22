import { type Snippet } from 'svelte';
interface Props {
    placeholder?: string;
    idle?: Snippet<[number]>;
    search_description?: Snippet;
    no_results?: Snippet;
}
/**
 * Renders a search box as an overlay that can be used to search the documentation.
 * It appears when the user clicks on the `Search` component or presses the corresponding keyboard shortcut.
 */
declare const SearchBox: import("svelte").Component<Props, {}, "">;
type SearchBox = ReturnType<typeof SearchBox>;
export default SearchBox;
