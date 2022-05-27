import {API} from './API'
const {contextBridge} = require("electron")

contextBridge.exposeInMainWorld("api", API)
