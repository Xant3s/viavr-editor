import {app} from 'electron'
import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'
import PreferencesManager from './Preferences/PreferencesManager'


const init = async () => {
    const mainWindow = new MainWindow(app)
    new SpokeManager(app)
    const preferencesManager = PreferencesManager.getInstance()
    await preferencesManager.init()
    new BuildSystem(mainWindow.window)
}

init()
