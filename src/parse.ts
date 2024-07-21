import {Config, CustomError, RawGoods, SheetData} from "./types";
import path from "path";
import fsPromises from "fs/promises";

export function parseDataVars(config: Record<string, string>, workDir: string): Config {
    const threadsAmount = +config['THREADS_AMOUNT'] || 1
    let output = config['OUTPUT'] || 'result'
    const dataFile = config['DATA_FILE'] || 'data'

    if (!path.isAbsolute(output)) {
        output = path.join(workDir, output)
    }

    return {
        threadsAmount, output, dataFile
    }
}

export async function parseOutputDir(outputDir: string) {
    try {
        await fsPromises.mkdir(outputDir)
    } catch (e) {
        // folder already exists => just clean it
        for (const file of await fsPromises.readdir(outputDir)) {
            await fsPromises.rm(path.join(outputDir, file), {recursive: true, force: true})
        }
    }
}

export function parseRawGoodsData(data: SheetData): Array<RawGoods> {
    const header = data[0]

    const indexInd = header.findIndex(key => key === 'index')
    const nameInd = header.findIndex(key => key === 'name')
    const linkInd = header.findIndex(key => key === 'link')

    if (indexInd < 0 || nameInd < 0 || linkInd < 0) {
        throw new CustomError('Required fields "index" and/or "link" are not specified in the data file')
    }

    return data.map((item: Array<string>, i: number) => {
        if (i === 0) {
            return null
        }

        const index = item[indexInd] || ''
        const name = item[nameInd] || ''
        const link = item[linkInd] || ''

        return { index, name, link }
    }).filter((item) : item is RawGoods => !!item)
}