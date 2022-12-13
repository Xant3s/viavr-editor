import Author from './Author'

export default interface Package {
    author: Author
    description: string
    displayName: string
    hideInEditor: boolean
    mandatory: boolean
    name: string
    unity: string
    unityRelease: string
    version: string
}
