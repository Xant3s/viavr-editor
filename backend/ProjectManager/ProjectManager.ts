import { app, BrowserWindow, dialog, ipcMain as ipc } from 'electron'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as Path from 'path'
import MainWindow from '../MainWindow'
import Utils from '../BuildSystem/Utils'
import { channels } from '../API'
import EventEmitter from 'events'
import ProjectSettingsManager from './ProjectSettingsManager'
import { exec } from 'child_process'
import fastFolderSizeSync = require('fast-folder-size/sync')
import { API } from '../API'
import SceneExporter from './SceneExporter'
import { SpokeAPI } from '../../frontend/src/SpokeEditor/SpokeAPI'


export default class ProjectManager {
    private static instance: ProjectManager
    private readonly zipThresholdInMB: number = 5000
    private mainWindow!: MainWindow
    private _projectPath!: string
    private _presentWorkingDirectory!: string
    private onProjectOpenedEvent: EventEmitter = new EventEmitter()
    private exporter!: SceneExporter
    private projectExportHasFailed = false;

    public static getInstance(): ProjectManager {
        if(!ProjectManager.instance) {
            ProjectManager.instance = new ProjectManager()
        }
        return ProjectManager.instance
    }

    public init(mainWindow: MainWindow, sceneExporter : SceneExporter) {
        this.mainWindow = mainWindow
        this.exporter = sceneExporter
    }

    /// The path to the current saved project. This may be the path to a .via file.
    get projectPath() {
        return this._projectPath
    }

    /// The path to the extracted project. May have unsaved changes. May be the same as project path for large projects.
    get presentWorkingDirectory() {
        return this._presentWorkingDirectory
    }

    public projectIsLoaded() {
        return this._projectPath !== undefined && this.presentWorkingDirectory !== undefined
            && this._projectPath !== '' && this.presentWorkingDirectory !== ''
    }

    public registerOnProjectLoadedListener(callback: () => void) {
        this.onProjectOpenedEvent.addListener('project-loaded', callback)
    }

    private constructor() {
        ipc.handle(channels.toMain.createNewProject, async () => this.createNewProject())
        ipc.handle(channels.toMain.openProject, async (event, recommendedProjectPath) => this.openProjectFromFile(recommendedProjectPath))
        ipc.handle(channels.toMain.openProjectFolder, async () => this.openProjectFromFolder())
        ipc.on('project-manager:save-project', async () => this.saveSceneAndProject())
        ipc.handle(channels.toMain.saveProject, async ()   => this.saveSceneAndProject())
        ipc.on('dev:open-pwd', async () => this.openPresentWorkingDirectory())
        ipc.handle(channels.toMain.getPresentWorkingDirectory, async () => this._presentWorkingDirectory)
        ipc.handle(channels.toMain.getSceneFileContents, async() => await this.getSceneFileContents())
        SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.sceneExport, this.saveProject.bind(this))
        SpokeAPI.Instance.addEventListener(SpokeAPI.Messages.fromSpoke.sceneExportFailed,() => this.projectExportHasFailed = true)
    }

    private async saveSceneAndProject(){
        await this.exporter.exportScene()
    }

    private async createNewProject() {
        const { canceled, filePath } = await dialog.showSaveDialog(this.mainWindow.window, {
            title: 'Create New Project',
            filters: [
                { name: 'VIA-VR Project', extensions: ['via'] },
            ],
        })
        if(!canceled && filePath !== undefined && filePath?.length > 0) {
            this._projectPath = filePath
            const tempProjectFolder = Path.join(app.getPath('temp'), 'viavr/project/')
            const scenesFolder = Path.join(tempProjectFolder, 'Scenes/')
            FileUtils.ensurePathExists(tempProjectFolder)
            fs.rmSync(tempProjectFolder, { recursive: true })
            FileUtils.ensurePathExists(scenesFolder)
            this._presentWorkingDirectory = tempProjectFolder
            this.mainWindow.send(channels.fromMain.projectCreated)
            this.onProjectOpenedEvent.emit('project-loaded')
            this.mainWindow.enableMenuOptionsOnProjectOpened()
        }
    }

    private async openProjectFromFile(defaultPath: string) {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if(focusedWindow != null) focusedWindow.setEnabled(false);
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            defaultPath: Path.join(app.getAppPath(), defaultPath),
            filters: [{ name: 'VIA-VR project files', extensions: ['via'] }],
        })
        if(focusedWindow != null) focusedWindow.setEnabled(true);
        if(!canceled && filePaths.length > 0) {
            console.log('Opening project from file: ' + filePaths[0])
            await this.openProjectFromFileNoPrompt(filePaths[0])
        }
        if(focusedWindow != null) focusedWindow.focus();
    }

    public async openProjectFromFileNoPrompt(filePath: string) {
        this._projectPath = filePath
        const tempProjectFolder = Path.join(app.getPath('temp'), 'viavr/project')
        if(fs.existsSync(tempProjectFolder)) {
            fs.rmSync(tempProjectFolder, { recursive: true })
        }
        await Utils.extractZipToPath(filePath, tempProjectFolder)
        this._presentWorkingDirectory = tempProjectFolder
        this.onProjectOpened()
    }

    private async openProjectFromFolder() {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if(focusedWindow != null) focusedWindow.setEnabled(false);
        const {
            canceled,
            filePaths,
        } = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
        if(focusedWindow != null) focusedWindow.setEnabled(true);
        if(!canceled && filePaths.length > 0) {
            this._projectPath = filePaths[0]
            this._presentWorkingDirectory = this._projectPath
            this.onProjectOpened()
        }
        if(focusedWindow != null) focusedWindow.focus();
    }

    private onProjectOpened() {
        this.onProjectOpenedEvent.emit('project-loaded')
        this.mainWindow.send(channels.fromMain.projectOpened)
        this.mainWindow.enableMenuOptionsOnProjectOpened()
    }

    public async saveProject() {
        if(this.projectExportHasFailed){
            this.projectExportHasFailed = false;
            return;
        }
        if(this._projectPath === undefined && this.presentWorkingDirectory === undefined) {
            console.error('No project loaded.')
            return
        }

        await ProjectSettingsManager.getInstance().set<string>('dev.viavr.editor.version', app.getVersion())

        const pwdSizeInBytes = fastFolderSizeSync(this.presentWorkingDirectory)
        if(pwdSizeInBytes !== undefined) {
            const pwdSizeInMB = pwdSizeInBytes / 1024 / 1024

            if(pwdSizeInMB < this.zipThresholdInMB) {
                if(Path.parse(this._projectPath).ext.length === 0) {
                    this._projectPath = Path.join(Path.dirname(this._projectPath), Path.parse(this._projectPath).name + '.via')
                    // If the project was previously too large, i.e. the project path is a directory,
                    // we are not removing that directory for now.
                    // The directory equals pwd, so we would get issues if we try to remove it too soon.
                }
                await Utils.compressToPath(this.presentWorkingDirectory, this._projectPath)
                // Now we could delete the old project folder. Not sure if we want to do that.
            } else if(this._projectPath === this.presentWorkingDirectory) {
                // Do nothing.
                // TODO: Architecture: add event
            } else {
                console.log('Project is too large to be save as .via file.')
                // TODO: Notify user
                const projectFolderName = Path.parse(this._projectPath).name
                fs.rmSync(this._projectPath, { recursive: true })   // Remove .via file that may or may not exist (it does not exist for new projects)
                this._projectPath = Path.join(Path.dirname(this._projectPath), projectFolderName) // TODO: what if this folder already exists and is unrelated?
                fse.copySync(this.presentWorkingDirectory, this._projectPath)
            }
            console.log('Project saved.')

            this.mainWindow.send(channels.fromMain.spokeProjectSavedSuccessfully)
        }
    }

    public async getSceneFileContents() {
        const scenesFolderPath = Path.join(this._presentWorkingDirectory, 'Scenes')
        const files = await fse.readdir(scenesFolderPath)
        const spokeFile = files.find((file) => Path.extname(file) === '.spoke')
        if(!spokeFile) return ''
        const spokeFilePath = Path.join(scenesFolderPath, spokeFile)
        const spokeFileContents = await fse.readJSON(spokeFilePath, 'utf8')
        return JSON.stringify(spokeFileContents)
    }

    private async openPresentWorkingDirectory() {
        await exec(`start "" ${this.presentWorkingDirectory}`)
    }
}
