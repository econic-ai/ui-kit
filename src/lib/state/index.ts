export { Persisted } from './Persisted.svelte';
export { Theme } from './theme.svelte';
export { AssistantState } from './assistant.svelte';

import { AssistantState } from './assistant.svelte';
import { Theme } from './theme.svelte';

export const assistant = new AssistantState(); 
export const theme = new Theme();
