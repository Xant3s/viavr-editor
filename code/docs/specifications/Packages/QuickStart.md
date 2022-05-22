# How to Create Packages for VIA-VR

This page serves as quick start on how to develop packages for the VIA-VR project. We focus on requirements specific to the VIA-VR project. Please read the general information if you are unfamiliar with any of those topics.

## General Information

- [VIA-VR C# Style Guide](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry/-/wikis/C%23-Style-Guide)
- [Semantic versioning](https://docs.unity3d.com/Manual/upm-semver.html)
- [How to install packages from our package registry](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry#how-to-install-packages)
- [Unity package manual](https://docs.unity3d.com/Manual/CustomPackages.html)
- [Unity versions to use](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/orga/software-versions#unity)

## Step 1: Create the Payload

## Step 2: Adopt the Package Structure

## Step 3: Configuration

<!-- TODO: Unity Bridge -->

<!-- TODO: package.json mandatory, keywords, ui manifest -->

## Package Manifest

VIA-VR Unity packages must have the following values in their `package.json`.

```json
{
    "author": {
    "name": "Games Engineering JMU W\u00fcrzburg",
    "url": "https://games.uni-wuerzburg.de"
    },
    "documentationUrl": "<LINK TO THE DOCUMENTATION>",
    "name": "de.jmu.ge.<PACKAGE NAME>",
    "publishConfig": {
        "registry": "https://packages.informatik.uni-wuerzburg.de/"
    }
}
```

## Package Manifest Extensions

Additionally, VIA-VR Unity packages can have the following custom properties in their `package.json`.


| Property    | Values            | Description |
| ------------- | ------------------- | ------------- |
| "mandatory" | `true` or `false` |             |
