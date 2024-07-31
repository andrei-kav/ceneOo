import {Config} from "./types";
import path from "path";
import fsPromises from "fs/promises";

export function parseConfigVars(config: Record<string, string>, workDir: string): Config {
    const threadsAmount = +config['THREADS_AMOUNT'] || 1
    let output = config['OUTPUT'] || 'result'
    const dataFile = config['DATA_FILE'] || 'data'
    const sheetName = config['SHEET_NAME'] || 'main'
    const scriptType = config['SCRIPT_TYPE'] || ''
    const waitDuring = +config['WAIT_DURING'] || 1000
    const waitAfter = +config['WAIT_AFTER'] || 1000
    const approaches = +config['APPROACHES'] || 1

    if (!path.isAbsolute(output)) {
        output = path.join(workDir, output)
    }

    return {
        threadsAmount, output, dataFile, sheetName, scriptType, waitDuring, waitAfter, approaches
    }
}

export async function parseOutputDir(outputDir: string) {
    try {
        await fsPromises.mkdir(outputDir)
    } catch (e) {
        // no need to clean up existing folder
        // for (const file of await fsPromises.readdir(outputDir)) {
        //     await fsPromises.rm(path.join(outputDir, file), {recursive: true, force: true})
        // }
    }
}