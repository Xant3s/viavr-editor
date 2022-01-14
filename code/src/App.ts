import HelloWorld from './HelloWorld'

import {app, BrowserWindow} from 'electron'
import Main from './main'

Main.main(app, BrowserWindow)
new HelloWorld()
