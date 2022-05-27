export const channels = {
    "toMain": {
        selectUnityPath: 'BuildSystem:select-unity-path',
        queryScenes: "BuildSystem:query-available-scenes",
        queryPackages: "BuildSystem:query-available-packages",
        createUnityProject: "BuildSystem:create-unity-project",
        buildUnityProject: "BuildSystem:build-unity-project",
        openBuildDirectory: "BuildSystem:open-build-directory",
        queryJsonScenes: "BuildSystem:query-available-json-scenes",
        setDarkMode: "dark-mode:set",
        requestPreference: "preferences:request",
        changePreference: "preferences:changed",
        createNewProject: "project-manager:create-new-project",
        openProject: "project-manager:open-project",
        openProjectFolder: "project-manager:open-project-folder",
        getPresentWorkingDirectory: "project-manager:get-present-working-directory"
    },
    "fromMain": {
        buildFinished: "BuildSystem:build-finished",
        readyToBuildProject: "BuildSystem:ready-to-build-project",
        preferenceChangedFromBackendUnityPath: "preferences:preference-changed-from-backend-unityPath",
        projectCreated: "project-manager:project-created",
        projectOpened: "project-manager:project-opened",
        spokeExportScene: "spoke:export-scene"
    }
}
