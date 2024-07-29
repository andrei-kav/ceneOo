import {Context, Goods} from "./types";
import * as xlsx from "xlsx";
import path from "path";
import * as fs from "fs";


export function writeResult(goods: Array<Goods>, context: Context) {
    const catalogToWrite = transformResult(goods)
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(catalogToWrite);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'main')

    const pathToResult = path.join(context.output, 'result.xlsx')
    removePreviousResult(pathToResult)
    xlsx.writeFileXLSX(workbook, pathToResult)
}

function transformResult(goods: Array<Goods>): Array<Array<string | number | null>> {
    const header = ['index', 'name', 'link', 'lowPrice', 'highPrice']
    const catalog = goods.map(item => {
        return [item.index, item.name, item.link, item.lowPrice, item.highPrice]
    })
    return [header, ...catalog]
}

function removePreviousResult(pathTo: string) {
    try {
        fs.rmSync(pathTo)
    } catch (e) {
        // result file does not exist
    }
}