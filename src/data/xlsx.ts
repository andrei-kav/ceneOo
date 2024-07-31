import path from "path";
import {Context, CustomError, EmbeddedSheets, RawGoods, SheetData} from "../types";
import * as xlsx from "xlsx";

export function getXlsxFileData(context: Context): Array<RawGoods> {
    const pathTo = path.join(context.workDir, `${context.dataFile}.xlsx`)
    return parseRawGoodsData(getData(pathTo)[context.sheetName])
}

function getData(path: string): EmbeddedSheets {
    try {
        const workbook = xlsx.readFile(path)
        const sheets: EmbeddedSheets = {}
        const options = {header: 1, raw: true}
        Object.entries(workbook.Sheets)
            .forEach(([name, sheet]: [string, xlsx.WorkSheet]) => {
                sheets[name] = xlsx.utils.sheet_to_json(sheet, options);
            })
        return sheets
    } catch (e) {
        throw new CustomError(`Failed to get the file data by path ${path}: ${e}`)
    }
}

function parseRawGoodsData(data: SheetData): Array<RawGoods> {
    const header = data[0]

    const indexInd = header.findIndex(key => key === 'index')
    const nameInd = header.findIndex(key => key === 'name')
    const linkInd = header.findIndex(key => key === 'link')

    if (indexInd < 0 || nameInd < 0 || linkInd < 0) {
        throw new CustomError('Required fields "index" and/or "link" are not specified in the data file')
    }

    const rawGoods =  data.map((item: Array<string>, i: number) => {
        if (i === 0) {
            return null
        }

        const index = item[indexInd] || ''
        const name = item[nameInd] || ''
        const link = item[linkInd] || ''

        return { index, name, link }
    }).filter((item) : item is RawGoods => !!item)

    const isLastEmpty = (rawGoods: Array<RawGoods>): boolean => {
        const last = rawGoods[rawGoods.length - 1]
        return [last.name, last.index, last.link].every(prop => prop ==='')
    }

    // remove the empty items at the end of an array
    while (isLastEmpty(rawGoods)) {
        rawGoods.pop()
    }

    return rawGoods
}