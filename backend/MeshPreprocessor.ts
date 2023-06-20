import { ipcMain } from 'electron'
import { channels } from './API'
import { spawn } from 'child_process'
import AppUtils from './Utils/AppUtils'
import {Settings} from '../frontend/src/@types/MeshPreprocessing.js'

export default class MeshPreprocessor {
    constructor() {
        ipcMain.handle(channels.toMain.runPreprocessor, async (event, paths, settings) => {
            try {
                await this.runPreprocessor(paths, settings)
            } catch(e) {
                console.log('catch')
                return 500
            }
            return 200
        })
    }

    async runPreprocessor(paths, settings: Settings) {
        return new Promise<number>((resolve, reject) => {
            const path = paths[0]
            const executablePath = `${AppUtils.getResPath()}preprocessMesh.exe`
            const embedTexturesArg = settings.embedTextures ? '--embed_textures' : ''
            const embedBuffersArg = settings.embedBuffers ? '--embed_buffers' : ''
            const noNormalMapsArg = settings.noNormalMaps ? '--no_normal_maps' : ''
            const adjustExistingNormalMapsArg = settings.adjustExistingNormalMaps ? '--adjust_existing_normal_maps' : ''
            const useVertexNormalsArg = settings.useVertexNormals ? '--use_vertex_normals' : ''
            const creaseAngleArg = `--crease_angle ${settings.creaseAngle}`
            const normalDeviationArg = `--normal_deviation ${settings.normalDeviation}`
            const args = [embedTexturesArg, embedBuffersArg, noNormalMapsArg, adjustExistingNormalMapsArg,
                                useVertexNormalsArg, creaseAngleArg, normalDeviationArg]
                                .join(' ')
            // TODO: out.gltf hardcoded for testing purposes only
            const command = `${executablePath} ${path} out.gltf ${args}`
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