import { ipcMain } from 'electron'
import { channels } from './API'
import AppUtils from './Utils/AppUtils'
import { Settings } from '../frontend/src/@types/MeshPreprocessing.js'
import path from 'path'
import SpawnHelper from './Utils/SpawnHelper'

export default class MeshPreprocessor {
    constructor() {
        ipcMain.handle(channels.toMain.runPreprocessor, async (event, paths, settings) => {
            try {
                await this.runPreprocessor(paths, settings)
            } catch (e) {
                console.log('Could not run preprocessor:', e)
                return 500
            }
            return 200
        })
    }

    async runPreprocessor(paths: string[], settings: Settings) {
        return new Promise<number>((resolve, reject) => {
            const filePath = paths[0]
            const directory = filePath.substring(0, filePath.lastIndexOf(path.sep))
            const fileName = filePath.substring(filePath.lastIndexOf(path.sep) + 1).split('.')[0]
            const targetFileName = `${fileName}_optimized.glb`
            const executablePath = `${AppUtils.getResPath()}preprocessMesh.exe`
            const embedTexturesArg = settings.embedTextures ? '--embed_textures' : ''
            const embedBuffersArg = settings.embedBuffers ? '--embed_buffers' : ''
            const noNormalMapsArg = settings.noNormalMaps ? '--no_normal_maps' : ''
            const adjustExistingNormalMapsArg = settings.adjustExistingNormalMaps ? '--adjust_existing_normal_maps' : ''
            const useVertexNormalsArg = settings.useVertexNormals ? '--use_vertex_normals' : ''
            const creaseAngleArg = `--crease_angle=${settings.creaseAngle}`
            const normalDeviationArg = `--normal_deviation=${settings.normalDeviation}`
            const args = [settings.percentValue.toString(), embedTexturesArg, embedBuffersArg, noNormalMapsArg, adjustExistingNormalMapsArg,
                useVertexNormalsArg, creaseAngleArg, normalDeviationArg]
                .filter(arg => arg !== '')
            const child = SpawnHelper.spawn(executablePath, [filePath, path.join(directory, targetFileName), ...args], {}, 'Preprocessor')

            child.on('exit', (code) => {
                if (code === 0) {
                    console.log('Child process completed successfully')
                    resolve(200)
                } else {
                    console.error('Child process failed with code:', code)
                    reject(500)
                }
            })
            child.on('error', (err) => {
                console.error('Error occurred in child process:', err)
                reject(500)
            })
        })
    }
}