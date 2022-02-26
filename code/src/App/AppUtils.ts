import {app} from 'electron'
import * as Path from 'path'

export default class AppUtils {
    public static getResPath() {
        return app.isPackaged ? Path.join(app.getAppPath(), '/../res') : Path.join(app.getAppPath(), '/res')
    }
}
