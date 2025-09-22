import { Persisted } from './Persisted.svelte';
class SearchState {
    #recent = new Persisted('sv:recent-searches', '[]');
    active = $state(false);
    query = $state('');
    get recent() {
        return JSON.parse(this.#recent.current);
    }
    set recent(value) {
        this.#recent.current = JSON.stringify(value);
    }
}
export const search = new SearchState();
