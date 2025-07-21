import { MediaQuery } from 'svelte/reactivity';
import { Persisted } from './Persisted.svelte';
class Theme {
    #preference = new Persisted('sv:theme', 'system');
    #query = new MediaQuery('prefers-color-scheme: dark');
    #system = $derived(this.#query.current ? 'dark' : 'light');
    get current() {
        return this.#preference.current === 'system' ? this.#system : this.#preference.current;
    }
    set current(value) {
        this.#preference.current = value === this.#system ? 'system' : value;
    }
}
export const theme = new Theme();
