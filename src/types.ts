export interface Config {
    threadsAmount: number;
    output: string;
    dataFile: string
}

export interface Context extends Config {
    workDir: string
}

export type SheetData = Array<Array<string>>
export type EmbeddedSheets = { [key: string]: SheetData }

export class CustomError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export interface RawGoods {
    index: string;
    name: string;
    link: string;
}

export interface Goods extends RawGoods {
    lowPrice: number;
    highPrice: number;
}