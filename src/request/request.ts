import {Goods, RawGoods} from "../types";
import {log} from "../logs";

export async function request(goods: RawGoods): Goods {
    const response = await fetch(goods.link)

    if (response.ok) {
        const buffer: ArrayBuffer = await response.arrayBuffer();
        const json = Buffer.from(buffer).toString('utf-8')
        console.log(json)
    } else {
        log("HTTP error: " + response.status);
    }
}