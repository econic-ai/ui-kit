import type { Document } from '../../types';
export declare function create_index(documents: Record<string, string>, assets: Record<string, string>, base: string, read: (asset: string) => Response): Promise<Record<string, Document>>;
