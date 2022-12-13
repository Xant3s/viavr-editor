import extract = require('extract-zip')
import AdmZip from 'adm-zip'

export default class Utils {
    public static async extractZipToPath(zipPath: string, outputPath: string) {
        try {
            await extract(zipPath, {dir: outputPath})
        } catch(err) {
            console.log(err)
        }
        return outputPath
    }

    public static async compressToPath(folderPath: string, outputPath: string) {
        let zip = new AdmZip()
        zip.addLocalFolder(folderPath)
        zip.writeZip(outputPath)
    }
}
