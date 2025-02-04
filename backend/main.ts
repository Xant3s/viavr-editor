import { app } from 'electron'
import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'
import PreferencesManager from './Preferences/PreferencesManager'
import ProjectManager from './ProjectManager/ProjectManager'
import SceneExporter from './ProjectManager/SceneExporter'
import DialogUtils from './Utils/DialogUtils'
import ProjectSettingsManager from './ProjectManager/ProjectSettingsManager'
import ViavrServicesManager from './ViavrServicesManager'
import { Prototypes } from './Prototypes'
import { ArticyManager } from './ArticyManager'
import { SceneUtils } from './Utils/SceneUtils'
import { ProjectTags } from './ProjectManager/ProjectTags'
import MeshPreprocessor from './MeshPreprocessor'
import { AvatarManager } from './AvatarManager'
import { Logger } from './Logger'
import { LocalizationManager } from './LocalizationManager'
import CustomMenu from './CustomMenu'

const startup = async () => {
    const mainWindow = new MainWindow()
    SpokeManager.getInstance().waitForSpokePort(mainWindow)
    ViavrServicesManager.getInstance()
    const preferencesManager = PreferencesManager.getInstance()
    await preferencesManager.init()
    const sceneExport = new SceneExporter(mainWindow)
    ProjectManager.getInstance().init(mainWindow, sceneExport)
    ProjectSettingsManager.getInstance()
    new BuildSystem(mainWindow.window)
    new DialogUtils()
    new Prototypes()
    ArticyManager.getInstance().init(mainWindow)
    new ProjectTags()
    new MeshPreprocessor()
    new AvatarManager()
    await SceneUtils.register()
    LocalizationManager.getInstance().setMainWindow(mainWindow)
    await LocalizationManager.getInstance().ensureLanguageIsInPreferences()
    await new CustomMenu().loadCustomMenu()
    Logger.get()
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  
        // Prevent having error
        event.preventDefault()
        // and continue
        callback(true)
    })
}

const tryOpenProject = async () => {
    // Also see https://github.com/electron/electron/issues/4690
    if (process.argv.length > 1 && process.argv[1] !== '.') {
        console.log(`Opening project ${process.argv[1]}`)
        await ProjectManager.getInstance().openProjectFromFileNoPrompt(process.argv[1])
    }
}

app.whenReady().then(tryOpenProject)

startup()
