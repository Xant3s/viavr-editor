export class SpokeAPI {
    private static instance: SpokeAPI
    private spokeWindow: Window | undefined


    private constructor() {}

    public static get Instance(): SpokeAPI {
        return this.instance || (this.instance = new this())
    }

    public set SpokeWindow(spokeWindow: Window) {
        console.log('SpokeAPI: SpokeWindow set')
        this.spokeWindow = spokeWindow
    }

    public get IsReady() {
        return this.spokeWindow !== undefined
    }
}