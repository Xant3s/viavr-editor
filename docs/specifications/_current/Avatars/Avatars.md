# Avatars

## Avatars in Unity

- When the Unity project is created all downloaded avatars are exported to `Assets/Avatars` (currently `Assets/Avatars/uuid/result.fbx` and `Assets/Avatars/uuid/skin_basecolor.png`)
- The list of available avatars is stored in the build settings
  - During edit time (when the avatar loader package should be doing its thing) the build settings are available at `Assets/Settings/BuildSettings.json`
  - During runtime the build settings are available at `Resources/BuildSettings.json`


Example build settings:  


```json
{
  // ...other stuff...
  "avatars": [
    {
      "name": "Test Avatar",
      "token": "7972979e-4710-11ee-82ac-d6007ec8b6a7",
      "articyId": "5695c566-7196-4fae-a3bf-8b5648495cd2",
      "sceneObject": "dddd78ea-24b1-45d2-b732-b1a831f4ec06"
    }
  ]
}
```

- `token` is the TUD server ID. This is also the folder name, e.g. `Assets/Avatars/7972979e-4710-11ee-82ac-d6007ec8b6a7/result.fbx`
- `sceneObject` is the uuid for the corresponding placeholder object in the scene. You can find that GameObject using its `Uuid` component. The `sceneObject` value corresponds to `Uuid.uuid` (the public variable of type `Guid` named `uuid` in the `Uuid` `MonoBehaviour` component)