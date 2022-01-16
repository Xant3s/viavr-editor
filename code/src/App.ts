import HelloWorld from './HelloWorld'

import {app, BrowserWindow} from 'electron'
import Main from './main'
import BuildSystem from './BuildSystem'
import UnityManager from './BuildSystem/UnityManager'
import UnityPackageManager from './BuildSystem/UnityPackageManager'

Main.main(app, BrowserWindow)
new HelloWorld()
new BuildSystem()
new UnityManager()
new UnityPackageManager()
