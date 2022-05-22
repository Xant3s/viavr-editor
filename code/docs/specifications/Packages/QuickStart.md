# How to Create Packages for VIA-VR

This page serves as quick start on how to develop packages for the VIA-VR project. We focus on requirements specific to the VIA-VR project. Please read the general information if you are unfamiliar with any of those topics.

## General Information

- [VIA-VR C# Style Guide](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry/-/wikis/C%23-Style-Guide)
- [Semantic versioning](https://docs.unity3d.com/Manual/upm-semver.html)
- [How to install packages from our package registry](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/components/package-registry#how-to-install-packages)
- [Unity package manual](https://docs.unity3d.com/Manual/CustomPackages.html)
- [Unity versions to use](https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/orga/software-versions#unity)

## Step 1: Develop the Payload



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
