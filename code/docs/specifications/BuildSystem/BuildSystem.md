# Build System

The build system creates a Unity project based on the VIA-VR project and invokes the Unity build process to generate an executable application.

## Build Process Flowchart

```mermaid
flowchart TD;
subgraph viavr[VIA-VR Editor]
    qp[Query packages from registry] --> usp[/User selects packages to install/]
    usp --> uss[/User selects scenes/]
    uss --> cp[Copy Unity project template]
    cp --> ss[Setup scoped registry]
    ss --> ap[Add selected packages to manifest]
end
subgraph Unity
    uop[Generate Unity project files]
    uop --> usi[Add scenes to build settings]
    usi --> up([Unity project])
    up --> ub[Build project]
    ub --> exe([Executable])
end
viavr -- Invoke BuildUtils package in batch mode --> Unity
```

<!-- TODO: add specification how packages load configuration form the VIA-VR editor, how behaviors are added to scenes, etc -->

## BuildUtils Package [Outdated]

- The build utils must provide the method `de.jmu.ge.BuildUtils.BuildManager.BuildToDefaultPath`, which builds the executable
- The build utils must provide the method `de.jmu.ge.BuildUtils.SceneImporter.AddScenesToBuildSettings`, which reads the file `Assets/Settings/scenes.txt`. This file lists all scenes that should be considered for the executable, one per line, including the path relative to the `Assets` directory. For example:

```txt
 Assets/Scenes/SampleScene.unity
 Assets/Scenes/SampleScene2.unity
```

## Scene Export Pipeline

![SceneExportPipeline](images/SceneExportPipeline.png)
