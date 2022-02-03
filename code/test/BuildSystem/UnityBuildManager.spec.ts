import {expect} from 'chai'
import {mock} from 'ts-mockito'
import BuildSystem from '../../src/App/BuildSystem/BuildSystem'
import UnityBuildManager from '../../src/App/BuildSystem/UnityBuildManager'




describe('UnityBuildManager', () => {
    describe('Test addScopedRegistryToManifest', () => {
        it('should create a array of scoped registries if there is none', () => {
            const buildSystem: BuildSystem = mock(BuildSystem);
            const unityBuildManager = new UnityBuildManager(buildSystem)
            let manifest = {}
            const url = 'url'
            const name = 'name'
            const scope = 'scope'
            unityBuildManager.addScopedRegistryToManifest(manifest, url, name, scope)
            expect(manifest['scopedRegistries']).to.be.an('array')
            expect(manifest['scopedRegistries']).to.have.lengthOf(1)
        })
    })
})
