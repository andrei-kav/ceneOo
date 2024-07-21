import {Context, RawGoods} from "./types";
import {getXlsxFileData} from "./data/getXlsx";
import {parseRawGoodsData} from "./parse";
import {log} from "./logs";

export async function scan(context: Context) {
    const fileData = getXlsxFileData(context)
    console.log('fileData', fileData)
    const rawGoods = parseRawGoodsData(fileData['main'])
    const parts = breakIntoParts(rawGoods, context.threadsAmount)
    const threads = parts.map(part => run(part))
    await Promise.allSettled(threads)
}

function breakIntoParts(rawGoods: Array<RawGoods>, threadAmount: number): Array<Array<RawGoods>> {
    const parts = []
    const wholeAmount = rawGoods.length
    const chunkSize = Math.ceil(wholeAmount / threadAmount)
    for (let i = 0; i < wholeAmount; i += chunkSize) {
        const end = Math.min(i + chunkSize, wholeAmount)
        parts.push(rawGoods.slice(i, end))
    }
    return parts;
}

function run(part: Array<RawGoods>) {
    for (const rawGoods of part) {
        try {

        } catch (error) {
            log(error)
        }
    }
}