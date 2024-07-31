import {CustomError, Goods, GoodsPrice, RawGoods} from "../types";
import { JSDOM } from 'jsdom';
import {log} from "../logs";

export async function request(goods: RawGoods, scriptType: string): Promise<Goods> {
    log(`Requesting the ${goods.index}`);

    const ifNotFound = { ...goods, lowPrice: null, highPrice: null }
    let response = null
    try {
        response = await fetch(goods.link)
    } catch (error) {
        log(`Fetching error: ${error}`);
        return ifNotFound
    }

    if (response?.ok) {
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
        log(`HTTP response error: ${response?.status}`);
        return ifNotFound
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

    const offers = parsed?.['offers'];
    let lowPrice = 0
    let highPrice = 0

    if (offers) {
        lowPrice = offers['lowPrice'] ?? offers['price']
        highPrice = offers['highPrice'] ?? offers['price']
    }

    return {
        lowPrice, highPrice
    }
}