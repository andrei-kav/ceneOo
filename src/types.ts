export interface Config {
    threadsAmount: number;
    output: string;
    dataFile: string;
    scriptType: string;
    waitDuring: number;
    waitAfter: number;
    approaches: number;
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

export interface GoodsPrice {
    lowPrice: number | null;
    highPrice: number | null;
}

export type Goods = RawGoods & GoodsPrice