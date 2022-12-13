export class ScopedRegistry {
    public name: string
    public url: string
    public scopes: string[]

    constructor(name: string, url: string, scopes: string[]) {
        this.name = name
        this.url = url
        this.scopes = scopes
    }
}
