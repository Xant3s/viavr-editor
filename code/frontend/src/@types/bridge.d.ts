import {API} from '../../../backend/preload'

declare global {
    interface Window {
        api: typeof API
    }
}
