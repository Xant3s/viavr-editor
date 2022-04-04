import {app, ipcMain as ipc} from 'electron'
import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'
import PreferencesManager from './Preferences/PreferencesManager'
import ProjectManager from './ProjectManager/ProjectManager'
import SceneExporter from './ProjectManager/SceneExporter'


const init = async () => {
    const mainWindow = new MainWindow(app)
    new SpokeManager(app)
    const preferencesManager = PreferencesManager.getInstance()
    await preferencesManager.init()
    ProjectManager.getInstance().init(mainWindow)
    new SceneExporter(mainWindow)
    new BuildSystem(mainWindow.window)

    ipc.handle('get-main-window-url', () => {
        return new Promise((resolve) => {
            resolve(mainWindow.window.webContents.getURL())
        })
    })

    ipc.on('print-main-window-url', () => console.log(mainWindow.window.webContents.getURL()))
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

