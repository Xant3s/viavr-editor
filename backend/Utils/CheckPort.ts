import net from 'net'

export function checkPort(port: number, host = 'localhost'): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = new net.Socket()
        socket.setTimeout(1000) // Timeout after 1 second

        // Resolve true if the connection succeeds
        socket.connect(port, host, () => {
            socket.destroy() // Close the socket
            resolve(true)
        })

        // Resolve false if there’s an error or timeout
        socket.on('error', () => {
            socket.destroy()
            resolve(false)
        })
        socket.on('timeout', () => {
            socket.destroy()
            resolve(false)
        })
    })
}