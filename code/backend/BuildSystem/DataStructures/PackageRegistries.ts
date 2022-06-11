export interface PackageRegistry {
    "packageRegistryUrl": {
        "value": string,
        "label": string,
        "kind": "string"
    },
    "packageRegistryName": {
        "value": string,
        "label": string,
        "kind": "string"
    },
    "packageRegistryScopes": {
        "value": string,
        "label": string,
        "kind": "string"
    }
}

export interface PackageRegistries {
    value: PackageRegistry[],
    label: string
}
