import {app} from 'electron'
import MainWindow from './mainWindow'
import BuildSystem from './BuildSystem/BuildSystem'

MainWindow.main(app)
new BuildSystem()

