import type { Modules } from './index';
/**
 * Replace module/export placeholders during `sync-docs`
 */
export declare function preprocess(file: string, modules: Modules): Promise<string>;
