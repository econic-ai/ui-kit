

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BReiym4V.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/KeSb2ija.js"];
export const stylesheets = [];
export const fonts = [];
