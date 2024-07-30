import path from "path";
import {Context, CustomError, EmbeddedSheets} from "../types";
import * as xlsx from "xlsx";

export function getXlsxFileData(context: Context): EmbeddedSheets {
    const pathTo = path.join(context.workDir, `${context.dataFile}.xlsx`)
    return getData(pathTo)
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