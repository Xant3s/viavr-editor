import {API} from './API'
import { contextBridge } from 'electron'


contextBridge.exposeInMainWorld("api", API)
