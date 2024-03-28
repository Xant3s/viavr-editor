type Callback = (content?: string) => void

export class SpokeAPI {
    private static instance: SpokeAPI
    private spokeWindow: Window | undefined
    private events = new Map<string, Callback[]>()
    private spokeDoneLoading = false


    private constructor() {}

    public static get Instance(): SpokeAPI {
        return this.instance || (this.instance = new this())
    }

    public set SpokeWindow(spokeWindow: Window | undefined) {
        SpokeAPI.Instance.spokeWindow = spokeWindow
        SpokeAPI.Instance.spokeWindow?.addEventListener('message', this.onMessageFromSpoke)
    }

    public get IsReady() {
        return SpokeAPI.Instance.spokeWindow !== undefined && SpokeAPI.Instance.spokeDoneLoading
    }

    public postMessage(message: string, content?: string) {
        SpokeAPI.Instance.spokeWindow?.postMessage({
            channel: message,
            content: content
        }, '*')
    }

    private onMessageFromSpoke(event: MessageEvent) {
        const channel: string = event.data['channel']
        const content: string | undefined = event.data['content']
        const validChannels = Object.values(SpokeAPI.Messages.fromSpoke)
        if(validChannels.includes(channel)) {
            SpokeAPI.Instance.spokeDoneLoading = true
            if(SpokeAPI.Instance.events.get(channel) !== undefined && (SpokeAPI.Instance.events.get(channel)?.length || 0) > 0) {
                SpokeAPI.Instance.events.get(channel)?.forEach((func: Callback) => func(content))
            }
        }
    }
    
    public addEventListener(channel: string, func: Callback) {
        if(SpokeAPI.Instance.spokeWindow !== undefined) {
            const callbacks: Callback[] = SpokeAPI.Instance.events.get(channel) || []
            callbacks.push(func)
            SpokeAPI.Instance.events.set(channel, callbacks)
        } else {
            console.error('Spoke is not ready')
        }
    }
    
    public clearAllEventListeners() {
        SpokeAPI.Instance.events = new Map<string, Callback[]>()
    }

    public static readonly Messages = {
        toSpoke: {
            loadScene: 'viavr:load-scene',
            saveScene: 'viavr:export-scene',
            createScene: 'viavr:create-scene',
        },
        fromSpoke: {
            projectPageSelected: 'viavr:projects-page',
            sceneExport: 'viavr:scene-export',
            sceneExportFailed: 'viavr:scene-export-failed',
            exitTutorial: 'viavr:exit-tutorial',
        }
    }
}