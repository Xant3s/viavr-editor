import {ipcRenderer as ipc} from 'electron'
// import $ = require('jquery')

try {
    require('electron-reloader')(module)
} catch (_) {}

const btnTest = document.getElementById('btn-test')

btnTest?.addEventListener('click', () => {
    ipc.send('test')


    const spoke = document.getElementById('iframe-spoke') as HTMLIFrameElement
    const spokeDocument = spoke.contentDocument
    // const spoke = $('#spoke-container')

    // @ts-ignore
    spokeDocument?.getElementsByTagName('h1')[0].innerText = 'Hello World'

    // const h1 = spoke.getElementsByTagName('h1')[0] as HTMLHeadingElement
    // console.log(h1 === undefined)
    // h1.innerText = 'Hello'

    // $('#spoke-container').('h1').text('Hello')

    // window.frames['iframe-spoke'].document.getElementsByTagName('h1')[0].innerText = 'Hello'

    // query for h1 in spoke
    // const h1 = spoke.contents().find('h1')
    // @ts-ignore
    // h1?.textContent = 'Hello World'

    // console.log(h1 === null)
    // log text in h1
})
