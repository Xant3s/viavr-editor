interface Array<T> {
    findOrCreate(predicate: (element: T) => boolean, create: () => T): T
}

Array.prototype.findOrCreate = function <T>(predicate: (element: T) => boolean, create: () => T): T {
    const element = this.find(predicate)
    if(element === undefined) {
        this.push(create())
    }
    return this.find(predicate)
}
