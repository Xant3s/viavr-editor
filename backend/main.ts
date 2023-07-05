import { app } from 'electron'
import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'
import PreferencesManager from './Preferences/PreferencesManager'
import ProjectManager from './ProjectManager/ProjectManager'
import SceneExporter from './ProjectManager/SceneExporter'
import ThemeManager from './ThemeManager'
import DialogUtils from './Utils/DialogUtils'
import ProjectSettingsManager from './ProjectManager/ProjectSettingsManager'
import { Prototypes } from './Prototypes'
import { ArticyManager } from './ArticyManager'
import { SceneUtils } from './Utils/SceneUtils'
import { ProjectTags } from './ProjectManager/ProjectTags'
import ShareManager from './ShareManager'
import MeshPreprocessor from './MeshPreprocessor'
import { BuildSettings } from './BuildSystem/BuildSettings'

const startup = async () => {
    const mainWindow = new MainWindow()
    SpokeManager.getInstance()
    const preferencesManager = PreferencesManager.getInstance()
    await preferencesManager.init()
    new ThemeManager()
    ProjectManager.getInstance().init(mainWindow)
    ProjectSettingsManager.getInstance()
    new SceneExporter(mainWindow)
    new BuildSystem(mainWindow.window)
    new DialogUtils()
    new Prototypes()
    new ArticyManager()
    new ProjectTags()
    new BuildSettings()
    new ShareManager()
    new MeshPreprocessor()
    await SceneUtils.register()
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
