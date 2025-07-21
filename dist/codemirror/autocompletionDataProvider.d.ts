/**
 * this file is based on [dataProvider.ts from sveltejs/language-tools](https://github.com/sveltejs/language-tools/blob/master/packages/language-server/src/plugins/html/dataProvider.ts)
 */
export const globalEvents: {
    name: string;
}[];
/** @type {{ name: string, description?: string }[]} */
export const svelteEvents: {
    name: string;
    description?: string;
}[];
export const svelteAttributes: {
    name: string;
    description: string;
}[];
export const sveltekitAttributes: {
    name: string;
    description: string;
    valueSet: string;
    values: {
        name: string;
    }[];
}[];
export const svelteTags: ({
    name: string;
    description: string;
    attributes: ({
        name: string;
        description: string;
    } | {
        name: string;
        description?: undefined;
    })[];
} | {
    name: string;
    description: string;
    attributes: ({
        name: string;
        description: string;
        values: {
            name: string;
            description: string;
        }[];
    } | {
        name: string;
        description: string;
        values?: undefined;
    })[];
})[];
/** @type {Record<string, { name: string, description?: string }[]>} */
export const addAttributes: Record<string, {
    name: string;
    description?: string;
}[]>;
export const runes: ({
    snippet: string;
    test: import("./types").Test;
} | {
    snippet: string;
    test?: undefined;
})[];
