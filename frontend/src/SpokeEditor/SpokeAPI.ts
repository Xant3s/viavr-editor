type Callback = (content?: string) => void

export class SpokeAPI {
    private static instance: SpokeAPI
    private spokeWindow: Window | undefined


    private constructor() {}

    public static get Instance(): SpokeAPI {
        return this.instance || (this.instance = new this())
    }

    public set SpokeWindow(spokeWindow: Window) {
        this.spokeWindow = spokeWindow
    }

    public get IsReady() {
        return this.spokeWindow !== undefined
    }

    public postMessage(message: string, content?: string) {
        this.spokeWindow?.postMessage({
            channel: message,
            content: content
        }, '*')
    }

    public addEventListener(channel: string, func: Callback) {
        if(this.spokeWindow === undefined) {
            console.error('Spoke is not ready')
            return
        }
        this.spokeWindow.addEventListener('message', (event) => {
            if(event.data['channel'] !== channel) return
            const content = event.data['content']
            if(content === undefined) {
                func()
            } else {
                func(content)
            }
        })
    }

    public static readonly Messages = {
        toSpoke: {
            loadScene: 'viavr:load-scene',
            // saveScene: 'viavr:export-scene',
        },
        fromSpoke: {
            projectPageSelected: 'viavr:projects-page',
        }
    }
}