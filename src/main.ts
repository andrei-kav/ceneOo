import {log, setupLogs} from "./logs";
import fsPromises from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import {parseDataVars, parseOutputDir} from "./parse";
import {scan} from "./scan";

async function main() {
    const workDir = process.cwd()
    setupLogs(workDir)
    const rawConfig = await getEnvVars(workDir)
    const config = parseDataVars(rawConfig, workDir)
    await parseOutputDir(config.output)

    await scan({...config, workDir})
}

async function getEnvVars(workDir: string): Promise<Record<string, string>> {
    try {
        const contentBuf = await fsPromises.readFile(path.join(workDir, 'config'))
        return dotenv.parse(contentBuf)
    } catch (e) {
        // config is not set up
        log('Failed to read the config file. Apply default variables')
        return {}
    }
}

main()
    .then(() => {
        log('Successfully finished')
    })
    .catch(reason => {
        log(`Finished with the error: ${reason}`)
    })