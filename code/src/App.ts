import HelloWorld from './HelloWorld'

import {app, BrowserWindow} from 'electron'
import Main from './main'

Main.main(app, BrowserWindow)
new HelloWorld()


// const {BrowserView} = require('electron')
// const win = new BrowserWindow({width: 800, height: 600})
// const view = new BrowserView()
// win.setBrowserView(view)
// view.setBounds({x: 0, y: 0, width: 300, height: 300})
// view.webContents.loadURL('https://github.com')
