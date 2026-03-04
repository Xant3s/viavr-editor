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
import { AdbUtils } from './AdbUtils'

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
    new AdbUtils()
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

let isShuttingDown = false
app.on('before-quit', async (event) => {
    if (isShuttingDown) return

    // If it's a "natural" close attempt (X or Cmd+Q) and project is loaded, don't start cleanup yet.
    // Let it proceed to the window-close event where the "Save the project?" modal appears.
    if (!MainWindow.getIsActuallyQuitting() && ProjectManager.getInstance().projectIsLoaded()) {
        return
    }

    // Prevent the quit so we can do async cleanup.
    event.preventDefault()
    isShuttingDown = true

    console.log('Initiating graceful shutdown...')

    try {
        await Promise.all([
            ViavrServicesManager.getInstance().stopAllChildProcesses(),
            SpokeManager.getInstance().stopSpoke()
        ])
        console.log('All subprocesses terminated safely.')
    } catch (err) {
        console.error('Error during shutdown:', err)
    } finally {
        // Now that all is clear, call exit(0) to bypass any further blocking events.
        app.exit(0)
    }
})

startup()
