## Build Dialog

The build dialog is a GUI window that displays the settings required to build projects. It also displays package configurations. These package configurations correspond to the Unity package `configDescription` in the package manifest. See [package documentation](../packages/QuickStart.md) for more details. The build dialog will display all package configurations it can find in the registries that are specified in the preferences.

Package configurations are project-dependent, persistent settings. The package configurations come with a UI window and JSON serialization/deserialization. Package configurations are stored at `temp/viavr/project/packageSettings.json`. On Windows, this corresponds to  `%localappdata%\Temp\viavr\project\packageSettings.json`.


<!-- TODO: API: unityPackageSettings:set, unityPackageSettings:get -->
