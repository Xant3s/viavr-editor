import { useEffect, useState } from 'react'

export const DrawioEditor = ({onFloorMapAvailable}) => {
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMjFweCIgaGVpZ2h0PSI2MXB4IiB2aWV3Qm94PSItMC41IC0wLjUgMTIxIDYxIiBjb250ZW50PSImbHQ7bXhmaWxlIGhvc3Q9JnF1b3Q7ZW1iZWQuZGlhZ3JhbXMubmV0JnF1b3Q7IG1vZGlmaWVkPSZxdW90OzIwMjMtMDMtMTRUMTE6NTI6MzYuOTcwWiZxdW90OyBhZ2VudD0mcXVvdDs1LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgdmlhdnItZWRpdG9yLzAuMS4wIENocm9tZS8xMDAuMC40ODk2LjE0MyBFbGVjdHJvbi8xOC4yLjMgU2FmYXJpLzUzNy4zNiZxdW90OyBldGFnPSZxdW90O3ZTSF95eVV0LWU0VW1ucmNhNDc4JnF1b3Q7IHZlcnNpb249JnF1b3Q7MjEuMC42JnF1b3Q7IHR5cGU9JnF1b3Q7ZW1iZWQmcXVvdDsmZ3Q7Jmx0O2RpYWdyYW0gaWQ9JnF1b3Q7Uk1ncVdkUnhnNVN1bDVzZGJfS3YmcXVvdDsgbmFtZT0mcXVvdDtTZWl0ZS0xJnF1b3Q7Jmd0O2paTEJjb01nRUlhZmhydEthcE5yYlpKZWV2TFFNeU5iWVFyaUVJemFweStVSmVvNG5lbkYyZjMrWGRuOWdkQktUMWZMZXZGdU9DaFNaSHdpOUpVVVJYazYrbThBTTRLUUJkQmF5U1BLRjFETGIwQ1lJUjBraDl1bTBCbWpuT3kzc0RGZEI0M2JNR2F0R2JkbG4wWnRUKzFaQ3p0UU4wenQ2WWZrVGtSNkxKNFgvZ2F5RmVua3ZEeEZSYk5Vakp2Y0JPTm1YQ0Y2SnJTeXhyZ1k2YWtDRmJ4THZzUyt5eC9xWXpBTG5mdFBBNDBOZDZZRzNLMVNzdm55U0lBRm5OSE5hWEZyaG81RDZNMElmUm1GZEZEM3JBbnE2Ry9hTStHMDhsbnV3LzBzT040ZHJJTnBoWEMyS3hnTnpzNitCRlg2ZElndCtGQU9KZm8yTHJibnlVdXhzanpWTWJ6cDl2SHJ4UXdmb0I4cFhYei8xVmFQbDU1L0FBPT0mbHQ7L2RpYWdyYW0mZ3Q7Jmx0Oy9teGZpbGUmZ3Q7Ij48ZGVmcy8+PGc+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI2MCIgZmlsbD0icmdiKDI1NSwgMjU1LCAyNTUpIiBzdHJva2U9InJnYigwLCAwLCAwKSIgcG9pbnRlci1ldmVudHM9ImFsbCIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPjxzd2l0Y2g+PGZvcmVpZ25PYmplY3QgcG9pbnRlci1ldmVudHM9Im5vbmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHJlcXVpcmVkRmVhdHVyZXM9Imh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjRXh0ZW5zaWJpbGl0eSIgc3R5bGU9Im92ZXJmbG93OiB2aXNpYmxlOyB0ZXh0LWFsaWduOiBsZWZ0OyI+PGRpdiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIgc3R5bGU9ImRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiB1bnNhZmUgY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2FmZSBjZW50ZXI7IHdpZHRoOiAxMThweDsgaGVpZ2h0OiAxcHg7IHBhZGRpbmctdG9wOiAzMHB4OyBtYXJnaW4tbGVmdDogMXB4OyI+PGRpdiBkYXRhLWRyYXdpby1jb2xvcnM9ImNvbG9yOiByZ2IoMCwgMCwgMCk7ICIgc3R5bGU9ImJveC1zaXppbmc6IGJvcmRlci1ib3g7IGZvbnQtc2l6ZTogMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7Ij48ZGl2IHN0eWxlPSJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZTogMTJweDsgZm9udC1mYW1pbHk6IEhlbHZldGljYTsgY29sb3I6IHJnYigwLCAwLCAwKTsgbGluZS1oZWlnaHQ6IDEuMjsgcG9pbnRlci1ldmVudHM6IGFsbDsgd2hpdGUtc3BhY2U6IG5vcm1hbDsgb3ZlcmZsb3ctd3JhcDogbm9ybWFsOyI+Q2xpY2sgaGVyZTwvZGl2PjwvZGl2PjwvZGl2PjwvZm9yZWlnbk9iamVjdD48dGV4dCB4PSI2MCIgeT0iMzQiIGZpbGw9InJnYigwLCAwLCAwKSIgZm9udC1mYW1pbHk9IkhlbHZldGljYSIgZm9udC1zaXplPSIxMnB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DbGljayBoZXJlPC90ZXh0Pjwvc3dpdGNoPjwvZz48L2c+PHN3aXRjaD48ZyByZXF1aXJlZEZlYXR1cmVzPSJodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0V4dGVuc2liaWxpdHkiLz48YSB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01KSIgeGxpbms6aHJlZj0iaHR0cHM6Ly93d3cuZGlhZ3JhbXMubmV0L2RvYy9mYXEvc3ZnLWV4cG9ydC10ZXh0LXByb2JsZW1zIiB0YXJnZXQ9Il9ibGFuayI+PHRleHQgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMHB4IiB4PSI1MCUiIHk9IjEwMCUiPlRleHQgaXMgbm90IFNWRyAtIGNhbm5vdCBkaXNwbGF5PC90ZXh0PjwvYT48L3N3aXRjaD48L3N2Zz4='
    const [previewVisible, setPreviewVisible] = useState(true)
    const [imageSrc, setImageSrc] = useState(defaultImage)
    const previewStyle = { display: previewVisible ? 'block' : 'none', cursor: 'pointer' }
    let receivedPng = false
    let receivedXmlSvg = false


    const openDrawio = (evt) => {
        const url = 'https://embed.diagrams.net/?embed=1&ui=dark&spin=1&modified=unsavedChanges&proto=json&lang=en'
        const source = evt.srcElement || evt.target

        if(source.nodeName === 'IMG' && source.className === 'drawio') {
            if(source.drawIoWindow == null || source.drawIoWindow.closed) {
                setPreviewVisible(false)
                const iframe = CreateFullscreenIFrame()

                const close = function() {
                    window.removeEventListener('message', receive)
                    document.body.removeChild(iframe)
                }

                // Implements protocol for loading and exporting with embedded XML
                const receive = async function(evt) {
                    if(evt.data.length > 0 && evt.source === iframe.contentWindow) {
                        const msg = JSON.parse(evt.data)

                        // Received if the editor is ready
                        if(msg.event === 'init') {
                            // Sends the data URI with embedded XML to editor
                            // @ts-ignore
                            this.postMessage({
                                action: 'load',
                            })
                            // @ts-ignore
                            iframe.contentWindow.postMessage(JSON.stringify({
                                action: 'load', /*xmlsvg: diagramView.getAttribute('src'),*/
                                autosave: 1,
                                saveAndExit: '1',
                                modified: 'unsavedChanges',
                                xml: imageSrc,
                                title: 'Floor Map',
                            }), '*')
                        }
                        // Received if the user clicks save
                        else if(msg.event === 'save') {
                            // Sends a request to export the diagram as XML with embedded SVG
                            // @ts-ignore
                            iframe.contentWindow.postMessage(JSON.stringify(
                                { action: 'export', format: 'xmlsvg' }), '*')
                            // @ts-ignore
                            iframe.contentWindow.postMessage(JSON.stringify(
                                { action: 'export', format: 'png', spinKey: 'saving' }), '*')
                        }
                        // Received if the export request was processed
                        else if(msg.event === 'export') {
                            if(msg.message.format === 'xmlsvg') {
                                // Updates the data URI of the image
                                setImageSrc(msg.data)
                                await api.invoke(api.channels.toMain.floorMapNewSvg, msg.data)
                                receivedXmlSvg = true
                            } else if(msg.message.format === 'png') {
                                await api.invoke(api.channels.toMain.floorMapNewPng, msg.data)
                                receivedPng = true
                            }
                            onFloorMapAvailable()
                        }

                        // Received if the user clicks exit or after export
                        if(msg.event === 'exit' || (msg.event === 'export' && receivedPng && receivedXmlSvg)) {
                            close()
                            setPreviewVisible(true)
                            receivedXmlSvg = false
                            receivedPng = false
                        }
                    }
                }

                // Opens the editor
                window.addEventListener('message', receive)
                iframe.setAttribute('src', url)
                document.body.appendChild(iframe)
            }
        }
    }

    function CreateFullscreenIFrame() {
        const iframe = document.createElement('iframe')
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%;')
        return iframe
    }

    useEffect(() => {
        const loadFloorMap = async () => {
            const floorMap = await api.invoke(api.channels.toMain.floorMapLoadSvg)
            if(floorMap !== undefined) {
                setImageSrc(floorMap)
            }
        }
        loadFloorMap()
    }, [])

    return (
        <>
            <h1 style={titleStyle}>Click on the preview below to edit</h1>
            <div style={outerContainerStyle} onClick={(evt) => openDrawio(evt)}>
                <div style={innerContainerStyle}>
                    <img id='DiagramView' className='drawio' style={previewStyle} alt={''} src={imageSrc}></img>
                </div>
            </div>
        </>
    )
}

const titleStyle = {
    color: 'white',
    display: 'flex',
    justifyContent: 'center'
}

const outerContainerStyle = {
    height: 'calc(100vh - 56px)'
}

const innerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
}