import extract = require('extract-zip')

export default class Utils {
    public static async extractZipToPath(zipPath: string, outputPath: string) {
        try {
            await extract(zipPath, {dir: outputPath})
        } catch(err) {
            console.log(err)
        }
        console.log('Extracted template zip.')
        return outputPath
    }
}
