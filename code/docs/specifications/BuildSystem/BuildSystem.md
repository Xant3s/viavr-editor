<img src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fwww.tpaw.de%2Fimages%2Fwebsite-under-construction.jpg&sp=1653237814T0d94bb04a76220a087bdd1a45c0e9ce4c742c7e841474c603fb52b3734b8baf5" alt="Under construction" width="75%" style="alignment: center"/>

# Build System

The build system creates a Unity project based on the VIA-VR project and invokes the Unity build process to generate an executable application.

## Build Process Flowchart

<img src="images/BuildSystem_FlowGraph.png" alt="SceneExportPipeline" style="alignment: center"/>


<!-- TODO: add specification how packages load configuration form the VIA-VR editor, how behaviors are added to scenes, etc -->

## BuildUtils Package [Outdated]

- The build utils must provide the method `de.jmu.ge.BuildUtils.BuildManager.BuildToDefaultPath`, which builds the executable
- The build utils must provide the method `de.jmu.ge.BuildUtils.SceneImporter.AddScenesToBuildSettings`, which reads the file `Assets/Settings/scenes.txt`. This file lists all scenes that should be considered for the executable, one per line, including the path relative to the `Assets` directory. For example:

```txt
 Assets/Scenes/SampleScene.unity
 Assets/Scenes/SampleScene2.unity
```

## Scene Export Pipeline

<img src="images/SceneExportPipeline.png" alt="SceneExportPipeline" style="alignment: center"/>
