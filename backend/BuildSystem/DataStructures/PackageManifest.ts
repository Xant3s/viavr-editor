import { ScopedRegistry } from './ScopedRegistry'

export interface PackageManifest {
    dependencies?: Dependency[]
    scopedRegistries?: ScopedRegistry[]
}
