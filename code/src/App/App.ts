import {app} from 'electron'
import MainWindow from './mainWindow'
import BuildSystem from './BuildSystem/BuildSystem'

const mainWindow = new MainWindow(app)
new BuildSystem(mainWindow.window)

