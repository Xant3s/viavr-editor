import fs from 'fs'
import path from 'path'

export class FileUtils {
    public static ensurePathExists(path: string) {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
    }

    public static getFolderSize(directoryPath: string) {
        let totalSize = 0

        function readDir(dir: string) {
            const entries = fs.readdirSync(dir, { withFileTypes: true })
            for(const entry of entries) {
                const fullPath = path.join(dir, entry.name)
                if(entry.isDirectory()) {
                    readDir(fullPath)
                } else {
                    const stats = fs.statSync(fullPath)
                    totalSize += stats.size
                }
            }
        }

        readDir(directoryPath)
        return totalSize
    }
}