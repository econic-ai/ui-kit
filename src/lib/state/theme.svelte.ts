import { MediaQuery } from 'svelte/reactivity';
import { Persisted } from './Persisted.svelte';
import { browser } from '$app/environment';

export class Theme {
	#preference = new Persisted<'system' | 'light' | 'dark'>('sv:theme', 'system');
	#query = browser ? new MediaQuery('prefers-color-scheme: dark') : null;
	#system = $derived<'dark' | 'light'>(
		browser && this.#query ? (this.#query.current ? 'dark' : 'light') : 'light'
	);

	get current() {
		return this.#preference.current === 'system' ? this.#system : this.#preference.current;
	}

	set current(value: 'light' | 'dark') {
		this.#preference.current = value === this.#system ? 'system' : value;
	}
}

export const theme = new Theme();
