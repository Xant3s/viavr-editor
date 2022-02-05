import {expect} from 'chai'
import {mock} from 'ts-mockito'
import BuildSystem from '../../src/App/BuildSystem/BuildSystem'
import UnityBuildManager from '../../src/App/BuildSystem/UnityBuildManager'
import {PackageManifest} from '../../src/App/BuildSystem/DataStructures/PackageManifest'


describe('UnityBuildManager', () => {
    const buildSystem: BuildSystem = mock(BuildSystem);

    describe('Test addScopedRegistryToManifest', () => {
        it('should create an empty array of scoped registries if there is none', () => {
            const unityBuildManager: UnityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = {}
            unityBuildManager.addScopedRegistryToManifest(manifest, 'url', 'name', 'scope')
            expect(manifest['scopedRegistries']).to.be.an('array')
            expect(manifest['scopedRegistries']).to.have.lengthOf(1)
        })

        it('should create a new scoped registry with correct values if the manifest is empty', () => {
            const unityBuildManager: UnityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = {}
            const expectedUrl = 'url'
            const expectedName = 'name'
            const expectedScope = 'scope'
            unityBuildManager.addScopedRegistryToManifest(manifest, expectedUrl, expectedName, expectedScope)
            expect(manifest['scopedRegistries']).to.be.an('array')
            expect(manifest['scopedRegistries']).to.have.lengthOf(1)
            expect(manifest['scopedRegistries'][0]).to.have.property('url', expectedUrl)
            expect(manifest['scopedRegistries'][0]).to.have.property('name', expectedName)
            expect(manifest['scopedRegistries'][0]['scopes']).to.be.an('array')
            expect(manifest['scopedRegistries'][0]['scopes']).to.have.lengthOf(1)
            expect(manifest['scopedRegistries'][0]['scopes'][0]).to.be.equal(expectedScope)
        })

        it('should create a new scoped registry if none exists with the same url', () => {
            const unityBuildManager: UnityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = <PackageManifest> {
                "scopedRegistries": [
                    {
                        "url": "url1",
                        "name": "name",
                        "scopes": [
                            "scope"
                        ]
                    }
                ]
            }
            unityBuildManager.addScopedRegistryToManifest(manifest, 'url2', 'name', 'scope')
            expect(manifest['scopedRegistries']).to.exist
            if(manifest['scopedRegistries'] === undefined) return
            expect(manifest['scopedRegistries']).to.have.lengthOf(2)
            expect(manifest['scopedRegistries'].findIndex(r => r.url === 'url1')).to.not.be.equal(-1)
            expect(manifest['scopedRegistries'].findIndex(r => r.url === 'url2')).to.not.be.equal(-1)
        })

        it('should not create a new registry if there is already one with the same url', () => {
            const unityBuildManager: UnityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = <PackageManifest> {
                "scopedRegistries": [
                    {
                        "url": "url1",
                        "name": "name",
                        "scopes": [
                            "scope"
                        ]
                    }
                ]
            }
            unityBuildManager.addScopedRegistryToManifest(manifest, 'url1', 'name', 'scope')
            expect(manifest['scopedRegistries']).to.exist
            if(manifest['scopedRegistries'] === undefined) return
            expect(manifest['scopedRegistries']).to.have.lengthOf(1)
            expect(manifest['scopedRegistries'].findIndex(r => r.url === 'url1')).to.not.be.equal(-1)
        })

        it('should do nothing if an identical registry already exists', () => {
            const unityBuildManager: UnityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = <PackageManifest> {
                "scopedRegistries": [
                    {
                        "url": "url1",
                        "name": "name",
                        "scopes": [
                            "scope1"
                        ]
                    }
                ]
            }
            unityBuildManager.addScopedRegistryToManifest(manifest, 'url1', 'name', 'scope1')
            expect(manifest['scopedRegistries']).to.exist
            if(manifest['scopedRegistries'] === undefined) return
            expect(manifest['scopedRegistries']).to.have.lengthOf(1)
            expect(manifest['scopedRegistries'].findIndex(r => r.url === 'url1')).to.not.be.equal(-1)
            expect(manifest['scopedRegistries'][0]['scopes']).to.have.lengthOf(1)
            expect(manifest['scopedRegistries'][0]['scopes']).to.contain('scope1')
        })

        it('should add the scope to the existing registry if both registries have the same url but the scopes are different', () => {
            const unityBuildManager: UnityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = <PackageManifest> {
                "scopedRegistries": [
                    {
                        "url": "url1",
                        "name": "name",
                        "scopes": [
                            "scope1"
                        ]
                    }
                ]
            }
            unityBuildManager.addScopedRegistryToManifest(manifest, 'url1', 'name', 'scope2')
            expect(manifest['scopedRegistries']).to.exist
            if(manifest['scopedRegistries'] === undefined) return
            expect(manifest['scopedRegistries']).to.have.lengthOf(1)
            expect(manifest['scopedRegistries'].findIndex(r => r.url === 'url1')).to.not.be.equal(-1)
            expect(manifest['scopedRegistries'][0]['scopes']).to.have.lengthOf(2)
            expect(manifest['scopedRegistries'][0]['scopes']).to.contain('scope1')
            expect(manifest['scopedRegistries'][0]['scopes']).to.contain('scope2')
        })
    })
})
