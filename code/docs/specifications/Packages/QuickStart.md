# How to Create Packages for VIA-VR

This page serves as quick start on how to develop packages for the VIA-VR project. We focus on requirements and best practices specific to the VIA-VR project. Please read the general information if you are unfamiliar with any of those topics.

## General Information

- [VIA-VR C# Style Guide](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry/-/wikis/C%23-Style-Guide)
- [Semantic Versioning](https://docs.unity3d.com/Manual/upm-semver.html)
- [How to Install Packages from Our Package Registry](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry#how-to-install-packages)
- [Unity Package Manual](https://docs.unity3d.com/Manual/CustomPackages.html)
- [Unity Versions to Use](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/orga/software-versions#unity)

## Step 1: Develop the Payload

First, develop the payload, i.e. the functionality of your package. Feel free to adopt the package structure ([Step 2](#step-2-adopt-the-package-structure)) right away or work in a regular Unity project first. Your functionality should be as self-contained as possible. Keep coupling to a minimum. Use self-contained prefabs. Test your functionality in isolation (whitebox levels etc.). This step is no different from developing any other Unity package.

<div class="NOTE">
    <h5>EXAMPLE</h5>
    <p>
        A health bar system has the job to display someone's or something's heath. You would only have to create the health bar UI and a system which updates the health bar according to some data (the unsigned integer value). Your system just consumes the data. It does not need to know anything else. In particular, your system does not need to know the player, inventory, combat systems, enemies, etc. You system does not care where the data comes from, who's health it's displaying, etc. Your system can be reused for any number of entities, e.g. player, enemies, destructible objects, etc. Ideally, your system is parameterized, which allows it to be repurposed, e.g. to represent a stamina bar. Your package may contain one or more systems.
    </p>
</div>

## Step 2: Adopt the Package Structure

## Step 3: Configuration

<!-- TODO: Unity Bridge -->

<!-- TODO: ui manifest -->

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
  See <a href="https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/build-utils/-/blob/master/package.json">example</a>.</p>
</div>

<div class="WARNING">
  <h5>WARNING</h5>
  <p>Published packages with the 'viavr' keyword will become immediately visible to the VIA-VR editor. Do not add this keyword until the package can be used in a VIA-VR project.</p>
</div>

## Package Manifest Extensions

Additionally, VIA-VR Unity packages can have the following custom properties in their `package.json`.


| Property    | Values            | Description                                                                                           |
|-------------|-------------------|-------------------------------------------------------------------------------------------------------|
| "mandatory" | `true` or `false` | Determines whether all VIA-VR projects must install this package. Should be `false` for most packages. |
