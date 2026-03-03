import { spawn, exec, SpawnOptions, ExecOptions, ChildProcess, ExecException } from 'child_process'

/**
 * Utility for spawning child processes with platform-aware window hiding.
 * 
 * On Windows, subprocess console windows are hidden by:
 * 1. Removing `detached: true` (which forces a new console window that can't be hidden)
 * 2. Setting `stdio: 'pipe'` (prevents the child from allocating its own console)
 * 3. Setting `windowsHide: true` (tells CreateProcess to use CREATE_NO_WINDOW)
 */
export default class SpawnHelper {
    private static get isWindows(): boolean {
        return process.platform === 'win32'
    }

    /**
     * Spawn a child process, hiding its console window on Windows.
     * 
     * On Windows: `detached` is removed (it overrides windowsHide), `stdio` is set
     * to 'pipe', and `windowsHide` is enabled. Together these guarantee no visible
     * console window.
     */
    static spawn(command: string, args: string[] = [], options: SpawnOptions = {}): ChildProcess {
        const mergedOptions: SpawnOptions = { ...options }

        if (this.isWindows) {
            // detached: true on Windows creates a console window that CANNOT be hidden
            // by windowsHide. This is documented Node.js behavior.
            delete mergedOptions.detached
            mergedOptions.windowsHide = true
            // Use 'pipe' stdio so the child doesn't allocate its own console
            if (!mergedOptions.stdio) {
                mergedOptions.stdio = 'pipe'
            }
        }

        return spawn(command, args, mergedOptions)
    }

    /**
     * Execute a command string via shell, hiding its console window on Windows.
     */
    static exec(
        command: string,
        callbackOrOptions?: ExecOptions | ((error: ExecException | null, stdout?: string, stderr?: string) => void),
        callback?: (error: ExecException | null, stdout?: string, stderr?: string) => void
    ): ChildProcess {
        let options: ExecOptions = {}
        let cb = callback

        if (typeof callbackOrOptions === 'function') {
            cb = callbackOrOptions
        } else if (callbackOrOptions) {
            options = callbackOrOptions
        }

        if (this.isWindows) {
            options.windowsHide = true
        }

        if (cb) {
            return exec(command, options, cb)
        }
        return exec(command, options)
    }
}
