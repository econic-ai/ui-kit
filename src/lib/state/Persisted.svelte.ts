import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import { browser } from '$app/environment';

export class Persisted<T extends string = string> {
	#key: string;
	#storage: Storage | undefined;
	#fallback: T;
	#version = $state(0);

	#subscribe = createSubscriber((update) => {
		if (!browser) return () => {};
		return on(window, 'storage', (e) => {
			if (e.key === this.#key) {
				update();
			}
		});
	});

	constructor(
		key: string,
		fallback: T,
		storage = browser && typeof localStorage !== 'undefined' ? localStorage : undefined
	) {
		this.#key = key;
		this.#fallback = fallback;
		this.#storage = storage;
	}

	get current() {
		if (browser) {
			this.#subscribe(); // handle cross-tab updates
			this.#version; // handle same-tab updates
		}

		return (this.#storage?.getItem(this.#key) as T) ?? this.#fallback;
	}

	set current(v: T) {
		this.#storage?.setItem(this.#key, v);
		this.#version += 1;
	}
}
