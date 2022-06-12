import {app, ipcMain as ipc} from 'electron';
import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'
import PreferencesManager from './Preferences/PreferencesManager'
import ProjectManager from './ProjectManager/ProjectManager'
import SceneExporter from './ProjectManager/SceneExporter'
import ThemeManager from './ThemeManager'
import DialogUtils from './Utils/DialogUtils'
import {channels} from './API'
import ProjectSettingsManager from './ProjectManager/ProjectSettingsManager'


const init = async () => {
    const mainWindow = new MainWindow(app)
    SpokeManager.getInstance()
    const preferencesManager = PreferencesManager.getInstance()
    await preferencesManager.init()
    new ThemeManager()
    ProjectManager.getInstance().init(mainWindow)
    ProjectSettingsManager.getInstance()
    new SceneExporter(mainWindow)
    new BuildSystem(mainWindow.window)
    new DialogUtils()

    ipc.handle('get-main-window-url', () => {
        return new Promise((resolve) => {
            resolve(mainWindow.window.webContents.getURL())
        })
    })

    ipc.on('print-main-window-url', () => console.log(mainWindow.window.webContents.getURL()))
    ipc.handle(channels.toMain.requestURL, () => mainWindow.window.webContents.getURL())
}

const tryOpenProject = async () => {
    // Also see https://github.com/electron/electron/issues/4690
    if(process.argv.length > 1 && process.argv[1] !== '.') {
        console.log(`Opening project ${process.argv[1]}`)
        await ProjectManager.getInstance().openProjectFromFileNoPrompt(process.argv[1])
    }
}

app.whenReady().then(tryOpenProject)

init()
