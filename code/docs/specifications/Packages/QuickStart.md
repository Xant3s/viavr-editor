# How to Create Unity Packages for VIA-VR

This page serves as quick start on how to develop packages for the VIA-VR project. We focus on requirements and best practices specific to the VIA-VR project. Please read the general information if you are unfamiliar with any of those topics.

## General Information

- [VIA-VR C# Style Guide](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry/-/wikis/C%23-Style-Guide)
- [Semantic Versioning](https://docs.unity3d.com/Manual/upm-semver.html)
- [How to Install Packages from Our Package Registry](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry#how-to-install-packages)
- [Unity Package Manual](https://docs.unity3d.com/Manual/CustomPackages.html)
- [Unity Versions to Use](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/orga/software-versions#unity)

## Step 1: Develop the Payload

First, develop the payload, i.e. the functionality of your package. Feel free to adopt the package structure ([Step 2](#step-2-adopt-the-package-structure)) right away or work in a regular Unity project first. Your functionality should be as self-contained as possible. Keep coupling to a minimum. Use self-contained prefabs. Test your functionality in isolation (whitebox levels etc.).
This step is no different from developing any other Unity package.

<div class="NOTE">
    <h5>EXAMPLE</h5>
    <p>
        A health bar system has the job to display someone's or something's heath. You would only have to create the health bar UI and a system which updates the health bar according to some data (the unsigned integer value). Your system just consumes the data. It does not need to know anything else. In particular, your system does not need to know the player, inventory, combat systems, enemies, etc. You system does not care where the data comes from, who's health it's displaying, etc. Your system can be reused for any number of entities, e.g. player, enemies, destructible objects, etc. Ideally, your system is parameterized, which allows it to be repurposed, e.g. to represent a stamina bar. Your package may contain one or more systems.
    </p>
</div>

## Step 2: Adopt the Package Structure

Now adopt the package structure. Make sure to satisfy all specifications ([VIA-VR C# Style Guide](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry/-/wikis/C%23-Style-Guide), [Semantic Versioning](https://docs.unity3d.com/Manual/upm-semver.html), [Unity Package Manual](https://docs.unity3d.com/Manual/CustomPackages.html), [Unity Versions to Use](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/orga/software-versions#unity), [Package Manifest Values](#package-manifest), [Package Manifest Extensions](#package-manifest-extensions)). Add [samples](https://docs.unity3d.com/Manual/cus-samples.html) whenever it makes sense. Add documentation.
This step is no different from developing any other Unity package. You now have a fully functional Unity package that - once published - can be used in other projects without any additional steps.

<div class="NOTE">
    <h5>EXAMPLE</h5>
    <p>
        See the <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/example-package">example package</a> for a minimal example. You can also <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry#how-to-install-packages">install it from the package registry</a>.
    </p>
</div>

## Step 3: Configuration

So far your package is hopefully quite useful for fellow Unity developers who know how to code and are familiar with the Unity editor. To also make your package usable by VIA-VR editor users, do the following.

1. Create a serializable `Configuration` class, which declares the structure of the data your package consumes
2. Create a sample .json file which contains a sane default configuration for you package. The json structure must comply with the structure defined by your `Configuration` class. Place this file in `Settings/<YOUR PACKAGE NAME>/`. You can move it to your package samples.
3. Add the [Unity Bridge](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/via-vr-unity-bridge) package to the list of package dependencies inside your `package.json`
4. Use the `JsonLoader` provided by the Unity Bridge to load the configuration from your .json file. Use this configuration in your package. You can assume the .json exists at `Assets/Settings/<YOUR PACKAGE NAME>/Configuration.json`.
5. Create a `PackageConfigurator` class which inherits from `UnityBridge.core.PackageConfigurator`. Override the necessary [event functions](#event-functions) to automate all tasks you would usually do manually in the Unity editor

<div class="NOTE">
    <h5>EXAMPLE</h5>
    <p>
        A health bar package might define its configuration as a list of GameObject names that should have a health bar. The configuration might also include other parameterized settings like the health bar appearance, the initial health values, etc.
    </p>
    <p>
        Normally, you would have to add at least one MonoBehaviour to your scene. This MonoBehaviour would then load the the configuration and add health bars to all specified GameObjects when the game starts. To automate this step, you would override the OnConfigureScene method of your PackageConfigurator. In this method you would create a new GameObject and add your MonoBehavior as component.
    </p>
    <br />
    <p>
        Let's have a look at a concrete example: the <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer">Spoke Scene Importer</a> package. You can read up on what it does <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/README.md">here</a>.
    </p>
    <p>1. <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/Packages/de.jmu.ge.spokesceneimporter/Editor/Configuration.cs">Configuration</a> class</p>
    <p>2. <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/Packages/de.jmu.ge.spokesceneimporter/Samples~/FirstExample/Settings/Scenes.json">Example .json</a></p>
    <p>3. <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/Packages/de.jmu.ge.spokesceneimporter/package.json">Package manifest (line 18)</a></p>
    <p>4. <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/Packages/de.jmu.ge.spokesceneimporter/Editor/SceneImporter.cs">Loading the configuration (line 24)</a></p>
    <p>5. <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/spoke-scene-importer/-/blob/main/Packages/de.jmu.ge.spokesceneimporter/Editor/PackageConfigurator.cs">PackageConfigurator</a> class</p>
</div>

<div class="NOTE">
    <h5>NOTE</h5>
    <p>
        To test if your PackageConfigurator works, select 'Tools > VIA-VR Unity Bridge > Simulate Bridge Calls' from the Unity menu. For edit mode only.
    </p>
</div>

<!-- TODO: place settings.json in specified folder -->

<!-- TODO: add differences between editor and runtime packages -->

## Event Functions

Please refer to the [Unity Bridge documentation](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/via-vr-unity-bridge/-/blob/main/README.md) to learn about the available event functions.

## Package Manifest

VIA-VR Unity packages must have the following values in their `package.json`.

```json
{
    "author": {
        "name": "<AUTHOR NAME>",
        "url": "<AUTHOR WEBSITE>"
    },
    "description": "<SHORT DESCRIPTION OF THE PACKAGE>",
    "documentationUrl": "<LINK TO THE DOCUMENTATION>",
    "name": "<PACKAGE SCOPE>.<PACKAGE NAME>",
    "keywords": [
        "viavr"
    ],
    "publishConfig": {
        "registry": "<PACKAGE REGISTRY URL>"
    }
}
```

<div class="NOTE">
  <h5>NOTE</h5>
  <p>
  See <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/build-utils/-/blob/master/package.json">example manifest</a>.</p>
</div>

<div class="WARNING">
  <h5>WARNING</h5>
  <p>Published packages with the 'viavr' keyword will become immediately visible to the VIA-VR editor. Do not add this keyword until the package can be used in a VIA-VR project.</p>
</div>

## Package Manifest Extensions

Additionally, VIA-VR Unity packages can have the following custom properties in their `package.json`.


| Property    | Values            | Description                                                                                           |
|-------------|-------------------|-------------------------------------------------------------------------------------------------------|
| "mandatory" | `true` or `false` | Determines whether all VIA-VR projects must install this package. Should be `false` for most packages. This property is optional. It only has an effect if present and set to `true`. |

<!-- TODO: ui manifest -->

<!-- TODO: dependencies: registries/scopes inject into viavr editor -->