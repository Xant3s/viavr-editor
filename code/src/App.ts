import HelloWorld from './HelloWorld'

import {app, BrowserWindow} from 'electron'
import Main from './main'
import BuildSystem from './BuildSystem'

Main.main(app, BrowserWindow)
new HelloWorld()
new BuildSystem()
