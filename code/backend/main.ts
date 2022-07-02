import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'
import PreferencesManager from './Preferences/PreferencesManager'
import ProjectManager from './ProjectManager/ProjectManager'
import SceneExporter from './ProjectManager/SceneExporter'
import ThemeManager from './ThemeManager'
import DialogUtils from './Utils/DialogUtils'
import ProjectSettingsManager from './ProjectManager/ProjectSettingsManager'
import {Prototypes} from './Prototypes'


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
}

startup()
