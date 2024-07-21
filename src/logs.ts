import path from "path";
import fs, {WriteStream} from "fs";
import * as util from "util";

let LOGS_STREAM: WriteStream | null = null

export function setupLogs(workDir: string) {
    const pathToLogs = path.join(workDir, 'logs')
    try {
        fs.rmSync(pathToLogs)
    } catch (e) {
        // logs file does not exist
    }
    fs.appendFileSync(pathToLogs, '')
    LOGS_STREAM = fs.createWriteStream(pathToLogs)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(message: any) {
    console.log(message)
    LOGS_STREAM?.write(util.format(message) + '\n');
}