import {CustomError, Goods, GoodsPrice, RawGoods} from "../types";
import { JSDOM } from 'jsdom';
import {log} from "../logs";

export async function request(goods: RawGoods, scriptType: string): Promise<Goods> {
    log(`Requesting the ${goods.index}`);
    const response = await fetch(goods.link)

    if (response.ok) {
        const buffer: ArrayBuffer = await response.arrayBuffer();
        const xmlString = Buffer.from(buffer).toString('utf-8')
        try {
            const prices = getGoodsInfo(xmlString, scriptType)
            return { ...goods, ...prices }
        } catch (e) {
            log(e)
            return { ...goods, lowPrice: null, highPrice: null }
        }
    } else {
        throw new CustomError("HTTP error: " + response.status);
    }
}

function getGoodsInfo(xmlString: string, scriptType: string): GoodsPrice {
    const script = new JSDOM(xmlString)
        .window.document
        .querySelector(`script[type="${scriptType}"]`)

    if (!script) {
        throw new CustomError(`Goods Script with the info is not found`)
    }

    const parsed = JSON.parse(script.textContent as string)

    const lowPrice = parsed?.['offers']?.['lowPrice']
    const highPrice = parsed?.['offers']?.['highPrice']
    const price = parsed?.['offers']?.['price']

    return {
        lowPrice: lowPrice ?? price,
        highPrice: highPrice ?? price,
    }
}