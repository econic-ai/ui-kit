import { Renderer, type MarkedExtension } from 'marked';
export declare const SHIKI_LANGUAGE_MAP: {
    bash: string;
    env: string;
    html: string;
    svelte: string;
    sv: string;
    js: string;
    dts: string;
    css: string;
    ts: string;
    rust: string;
    '': string;
};
/**
 * Strip styling/links etc from markdown
 */
export declare function clean(markdown: string): string;
export declare const slugify: (str: string) => string;
export declare function smart_quotes(str: string, { first, html }?: {
    first?: boolean;
    html?: boolean;
}): string;
export declare function transform(markdown: string, { walkTokens, ...renderer }?: Partial<Renderer> & {
    walkTokens?: MarkedExtension['walkTokens'];
}): Promise<string>;
export declare function extract_frontmatter(markdown: string): {
    metadata: Record<string, string>;
    body: string;
};
/**
 * Type declarations include fully qualified URLs so that they become links when
 * you hover over names in an editor with TypeScript enabled. We need to remove
 * the origin so that they become root-relative, so that they work in preview
 * deployments and when developing locally
 */
export declare function strip_origin(str: string): string;
