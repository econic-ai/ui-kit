import { extract_frontmatter, slugify, smart_quotes } from '../../markdown/utils';
import type { Document } from '../../types';

/**
 * Normalize an asset URL for the read() function.
 * 
 * Different URL formats by context:
 * - Dev mode: /@fs/absolute/path/to/file.md (Vite filesystem access)
 * - Dev with base: /www/@fs/... or @fs/... (base path may be prepended)
 * - Build mode: /_app/immutable/assets/file.hash.md
 * - Build with base: /www/_app/immutable/... (base prepended) - KEEP THE BASE!
 * - Build with assets URL: http://cdn.example.com/_app/immutable/...
 * 
 * The read() function expects:
 * - Dev: /@fs/... format
 * - Build: The full path including base (e.g., /www/_app/immutable/...)
 *          because SvelteKit's build creates directories matching the base path
 */
function normalizeAssetUrl(url: string): string {
	// Handle @fs URLs (Vite's special filesystem access for files outside project root)
	// When base path is set, these can get mangled (e.g., /www/@fs/... or @fs/...)
	// The read() function expects /@fs/... format
	const fsIndex = url.indexOf('@fs/');
	if (fsIndex !== -1) {
		// Extract from @fs onwards and ensure leading slash
		return '/' + url.slice(fsIndex);
	}
	
	// If it's an absolute URL (CDN/external), extract just the pathname
	// For external assets URLs, we strip the origin but keep the path structure
	if (url.startsWith('http://') || url.startsWith('https://')) {
		try {
			const parsed = new URL(url);
			return parsed.pathname;
		} catch {
			// If URL parsing fails, return as-is
			return url;
		}
	}
	
	// For all other URLs (including those with base path like /www/_app/...),
	// return as-is. The read() function during build expects the full path
	// including the base path because SvelteKit creates the output directory
	// structure to match the base path.
	return url;
}

export async function create_index(
	documents: Record<string, string>,
	assets: Record<string, string>,
	base: string,
	read: (asset: string) => Response
): Promise<Record<string, Document>> {
	const content: Record<string, Document> = {};

	const roots: Document[] = [];

	for (const key in documents) {
		if (key.includes('+assets')) continue;

		const file = key.slice(base.length + 1);
		const slug = file.replace(/(^|\/)[\d-]+-/g, '$1').replace(/(\/index)?\.md$/, '');

		// Normalize the asset URL in case paths.assets is an absolute URL
		const assetPath = normalizeAssetUrl(documents[key]);
		const text = await read(assetPath).text();
		let { metadata, body } = extract_frontmatter(text);

		if (!metadata.title) {
			throw new Error(`Missing title in ${slug} frontmatter`);
		}

		metadata.title = smart_quotes(metadata.title);
		if (metadata.description)
			metadata.description = smart_quotes(metadata.description).replace(
				/`(.+?)`/g,
				'<code>$1</code>'
			);

        const thumbnailUrl = metadata.thumbnail;
        delete metadata.thumbnail;

		const sections = Array.from(body.matchAll(/^(#{1,3})\s+(.*)$/gm)).map((match) => {
			const level = match[1].length; // Count the number of # characters
			const title = smart_quotes(match[2])
				// replace < and > inside code spans
				.replace(/`(.+?)`/, (_, contents) => contents.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
				// turn e.g. `class:_name_` into `class:<em>name</em>`
				.replace(/_(.+)_/g, (_, contents) => `<em>${contents}</em>`);

			const slug = slugify(title);

			return { slug, title, level };
		});

		content[slug] = {
			slug,
			file,
			metadata: metadata as { title: string; [key: string]: any },
			breadcrumbs: [],
			body,
			sections,
			children: [],
            thumbnail: thumbnailUrl || "",
			prev: null,
			next: null
		};
	}

	for (const slug in content) {
		if (slug.includes('xx-')) continue;

		const parts = slug.split('/');
		parts.pop();

		const document = content[slug];

		if (parts.length === 0) {
			roots.push(document);
		} else {
			let parent = content[parts.join('/')];

			if (parent) {
				parent.children.push(document);

				while (parts.length) {
					document.breadcrumbs.unshift({ title: parent.metadata.title });
					parts.pop();
					parent = content[parts.join('/')];
				}
			} else {
				roots.push(document);
			}
		}
	}

	for (const key in assets) {
		const path = key.slice(base.length + 1);
		const slug = path.slice(0, path.indexOf('+assets') - 1).replace(/(^|\/)\d+-/g, '$1');
		const file = path.slice(path.indexOf('+assets') + 8);
		const document = content[slug];

		(document.assets ??= {})[file] = assets[key];
	}

	let prev: Document | null = null;

	for (const document of roots) {
		prev = create_links(document, prev);
	}

	return content;
}

function create_links(document: Document, prev: Document | null): Document | null {
	if (document.body) {
		link(prev, document);
		prev = document;
	}

	for (let i = 0; i < document.children.length; i += 1) {
		prev = create_links(document.children[i], prev);
	}

	return prev;
}

function link(prev: Document | null, next: Document | null) {
	if (prev) prev.next = next && { slug: next.slug, title: next.metadata.title };
	if (next) next.prev = prev && { slug: prev.slug, title: prev.metadata.title };
}
