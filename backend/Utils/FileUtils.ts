import fs from 'fs'

export class FileUtils {
    public static ensurePathExists(path: string) {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
    }
}