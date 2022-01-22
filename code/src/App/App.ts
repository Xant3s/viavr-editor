import {app, BrowserWindow} from 'electron'
import Main from './main'
import BuildSystem from './BuildSystem/BuildSystem'

Main.main(app, BrowserWindow)
new BuildSystem()

