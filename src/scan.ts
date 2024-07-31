import {Context, Goods, RawGoods} from "./types";
import {getXlsxFileData} from "./data/xlsx";
import {request} from "./request/request";
import {writeResult} from "./result";
import {log} from "./logs";

export async function scan(context: Context) {
    let rawGoods: Array<RawGoods> = []
    try {
        rawGoods = getXlsxFileData(context)
    } catch (e) {
        log(`Error during parsing initial data`)
        return Promise.reject(e)
    }

    const goods = await run(rawGoods, context)
    log(`Scanning is finished. The result: ${goods.toString()}`)
    writeResult(goods, context)
}

async function run(rawGoods: Array<RawGoods>, context: Context): Promise<Array<Goods>> {
    let results: Goods[] = []

    const empty = new Array(context.approaches).fill('')
    const starterPromise = Promise.resolve();
    await empty.reduce((promise: Promise<void>, _: string, index: number) => {
        return promise.then(
            () => {
                log(`Approach #${index + 1}: START`)
                return handleAll(index === 0 ? rawGoods : results, context)
                    .then(goods => results = goods)
                    .then(() => asyncTimeout(index === empty.length - 1 ? 0 : context.waitAfter))
            }
        )
    }, starterPromise)

    return results
}


async function handleAll(rawGoods: Array<RawGoods>, context: Context): Promise<Array<Goods>> {
    const results: Goods[] = []

    const parts = breakIntoParts(rawGoods, context.threadsAmount)

    const starterPromise = Promise.resolve();
    await parts.reduce((promise: Promise<void>, rawGoods: Array<RawGoods>) => {
        return promise.then(
            () => handleOne(rawGoods, context)
                .then(goods => results.push(...goods))
                .then(() => asyncTimeout(context.waitDuring))
        )
    }, starterPromise)

    return results
}

async function handleOne(rawGoods: Array<RawGoods | Goods>, context: Context): Promise<Array<Goods>> {
    const results: Goods[] = []

    for (const item of rawGoods) {
        // @ts-expect-error item is possibly handled => return it and continue the loop
        if ([item.lowPrice, item.highPrice].every(property => typeof property === 'number')) {
            // the item is already scanned
            log(`The Item is OK, ${item.name}, index: ${item.index}`)
            results.push(item as Goods)
        } else {
            log(`Working on the goods ${item.name}, index: ${item.index}`)
            const goods = await request(item, context.scriptType)
            results.push(goods)
        }
    }

    return results
}

function asyncTimeout(ms: number) {
    return (new Promise(resolve => {
        setTimeout(() => resolve(ms), ms)
    })).then(d => {
        log(`Waited ${d} seconds`)
    });
}

function breakIntoParts(rawGoods: Array<RawGoods>, threadAmount: number): Array<Array<RawGoods>> {
    const parts = []
    const wholeAmount = rawGoods.length
    for (let i = 0; i < wholeAmount; i += threadAmount) {
        const end = Math.min(i + threadAmount, wholeAmount)
        parts.push(rawGoods.slice(i, end))
    }
    return parts;
}

// function breakIntoParts(rawGoods: Array<RawGoods>, threadAmount: number): Array<Array<RawGoods>> {
//     const parts = []
//     const wholeAmount = rawGoods.length
//     const chunkSize = Math.ceil(wholeAmount / threadAmount)
//     for (let i = 0; i < wholeAmount; i += chunkSize) {
//         const end = Math.min(i + chunkSize, wholeAmount)
//         parts.push(rawGoods.slice(i, end))
//     }
//     return parts;
// }