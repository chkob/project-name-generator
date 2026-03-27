interface Options {
    number: boolean;
    words: number;
    alliterative: boolean;
    firstLetter?: string;
    blocklist?: string[];
    vocab: string;
    geo?: string;
    numDigit: string;
}
interface Result {
    raw: (string | number)[];
    dashed: string;
    spaced: string;
    dot: string;
    under_scored: string;
    camelCase: string;
}
declare function generate(options?: Partial<Options>): Result;
declare function blocklistFilter(blocklist: string[], raw: string[]): string[];

export { type Options, blocklistFilter, generate as default };
