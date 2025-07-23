/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 * @param {string} selected
 * @param {string[]} files
 * @returns {import('@codemirror/autocomplete').CompletionResult | null | false}
 */
export function completion_for_javascript(context: import("@codemirror/autocomplete").CompletionContext, selected: string, files: string[]): import("@codemirror/autocomplete").CompletionResult | null | false;
/**
 * @param {() => string} selected
 * @param {() => string[]} files
 * @returns {import('@codemirror/state').Extension[]}
 */
export function autocomplete_for_svelte(selected: () => string, files: () => string[]): import("@codemirror/state").Extension[];
