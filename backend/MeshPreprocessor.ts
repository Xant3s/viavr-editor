import { ipcMain } from 'electron'
import { channels } from './API'
import { spawn } from 'child_process'
import AppUtils from './Utils/AppUtils'

export default class MeshPreprocessor {
    constructor() {
        ipcMain.handle(channels.toMain.runPreprocessor, async (event, paths, settings) => {
            try {
                await this.runPreprocessor(paths, settings.percentValue, settings.embedTextures, settings.embedBuffers)
            } catch(e) {
                console.log('catch')
                return 500
            }
            return 200
        })
    }

    async runPreprocessor(paths, percentValue, embedTextures, embedBuffers) {
        return new Promise<number>((resolve, reject) => {
            // TODO: support all advanced settings
            const path = paths[0]
            const executablePath = `${AppUtils.getResPath()}preprocessMesh.exe`
            const embedTexturesArg = embedTextures ? '--embed_textures' : ''
            const embedBuffersArg = embedBuffers ? '--embed_buffers' : ''
            // TODO: out.gltf hardcoded for testing purposes only
            const command = `${executablePath} ${path} out.gltf ${percentValue} ${embedTexturesArg} ${embedBuffersArg}`
            console.log('Running command:', command)

            const childProcess = spawn(command)
            childProcess.on('exit', (code, signal) => {
                if(code === 0) {
                    console.log('Child process completed successfully')
                    resolve(200)
                } else {
                    console.error(`Child process exited with code ${code}`)
                    reject(500)
                }
            })
            childProcess.on('error', (error) => {
                console.error('Error occurred in child process:', error)
                reject(500)
            })
        })
    }
}