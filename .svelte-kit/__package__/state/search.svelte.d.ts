declare class SearchState {
    #private;
    active: boolean;
    query: string;
    get recent(): string[];
    set recent(value: string[]);
}
export declare const search: SearchState;
export {};
