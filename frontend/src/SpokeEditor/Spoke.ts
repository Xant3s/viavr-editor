import $ from 'jquery'


export const $$ = (query: string) => {
    const $spoke = $('#iframe-spoke').contents()
    return $spoke.find(query)
}

export function htmlElement(query: string, updateIntervalInMs = 100, timeout = 10_000): Promise<JQuery> {
    return new Promise((resolve, reject) => {
        const checkIfAvailable = () => {
            const element = $$(query)
            if(element.length > 0) {
                clearInterval(intervalId)
                resolve(element.first())
            }
        }

        const intervalId = setInterval(checkIfAvailable, updateIntervalInMs)
        setTimeout(() => {
            clearInterval(intervalId)
            reject(new Error('Timeout'))
        }, timeout)
    })
}
