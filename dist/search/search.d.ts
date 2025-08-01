import '@econic/ui-kit/polyfills';
import type { Block, BlockGroup } from './types';
/** If the search is already initialized */
export declare let inited: boolean;
/**
 * Initialize the search index
 */
export declare function init(blocks: Block[]): void;
/**
 * Search for a given query in the existing index
 */
export declare function search(query: string, path: string): BlockGroup[];
/**
 * Get a block with details by its href
 */
export declare function lookup(href: string): Block;
