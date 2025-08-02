import { Persisted } from './Persisted.svelte';

class AssistantState {
	#isOpen = new Persisted<'true' | 'false'>('sv:assistant-open', 'false');

	get isOpen() {
		return this.#isOpen.current === 'true';
	}

	set isOpen(value: boolean) {
		this.#isOpen.current = value ? 'true' : 'false';
	}

	toggle() {
		this.isOpen = !this.isOpen;
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}

export const assistant = new AssistantState(); 