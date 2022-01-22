import {app} from 'electron'
import MainWindow from './MainWindow'
import BuildSystem from './BuildSystem/BuildSystem'
import SpokeManager from './SpokeManager'

const mainWindow = new MainWindow(app)
new BuildSystem(mainWindow.window)
new SpokeManager(app)
