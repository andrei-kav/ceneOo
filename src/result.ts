import {Context, Goods} from "./types";
import * as xlsx from "xlsx";
import path from "path";
import * as fs from "fs";


export function writeResult(goods: Array<Goods>, context: Context) {
    const catalogToWrite = transformResult(goods)
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(catalogToWrite);
    xlsx.utils.book_append_sheet(workbook, worksheet, context.sheetName)

    const now = new Date()
    const date = now.getDate()
    const month = now.getMonth() + 1
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    // format is 'dataFile_sheetName_day.month_hours.minutes.seconds'
    const resultFileName = `${context.dataFile}_${context.sheetName}_${date}.${month < 10 ? '0' : ''}${month}_${hours}.${minutes < 10 ? '0' : ''}${minutes}.${seconds < 10 ? '0' : ''}${seconds}`

    const pathToResult = path.join(context.output, `${resultFileName}.xlsx`)
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