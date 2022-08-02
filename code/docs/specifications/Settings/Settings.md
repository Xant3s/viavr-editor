# Settings

The settings system consists of both backend and frontend systems, which in combination enable flexible and extensible settings. The UI is inferred from JSON and generated at runtime, which enables the display of settings retrieved from the internet or an external application.
The settings system is used for the [preferences](#preferences), [project settings](#project-settings), and [build dialog](#build-dialog).

## Preferences

Preferences are project-independent, persistent settings, e.g. the Unity editor path. The preferences come with a UI window, JSON serialization/deserialization, and static API for all systems to access. Systems can access the preferences using the [preferences API](#preferences-api). Preferences can be of any type. If a preference is of type `Setting_t`, it can be displayed by the `Setting` React component.

### Preferences API

#### PreferencesManager.getInstance()

Returns the singleton preferences manager. Can be used by all backend systems.

#### get<Type>(name: string): Type

Returns a preference identified by name.

##### Parameters

`name: string` - the name of the preference to retrieve

#### getAll()

Returns all preferences

##### Returns

Returns all preferences as array of `[string, Setting_t]`

#### set<Type>(name: string, value: Type)

Sets a preference. Changes will be saved to disk immediately. Also, the frontend receives an update event.

##### Parameters

`name: string` - the preference name. Is assumed to be unique
`value: Type` - the preference type

#### registerPreferenceUpdateEvent(preferenceName: string, f: (value: any) => void)

Registers an event listener. This callback is called when the particular preference is updated. Any backend system can register an event listener.

##### Parameters

`preferenceName: string` - the name of the preference. Is assumed to be unique  
`f: (value: any) => void` - the callback function

#### IPC: 'preferences:open'

Opens the preferences window

#### IPC: 'preferences:changed'

Updates the preference identified by uuid.

##### Parameters

`uuid: string` - the uuid (v4) used to identify the preference. This preference can be nested.  
`value: value_t` - the preference value

#### IPC: 'preferences:request'

Returns the preference identified by name

##### Parameters

`name: string` -  the preference name. Is assumed to be unique

#### IPC: 'preferences:request-all'

Returns all preferences as array of `[string, Setting_t]`

#### IPC: 'app:quit'

Saves the preferences to filesystem

## Project Settings

Project settings are project-dependent, persistent settings. The project settings come with a UI window, JSON serialization/deserialization, and static API for all systems to access. Systems can access the project settings using the project settings API.

### Project Settings API

#### ProjectSettingsManager.getInstance()

Returns the singleton project settings manager. Can be used by all backend systems.

#### get<Type>(name: string): Type

Returns a setting identified by name.

##### Parameters

`name: string` - name of the setting to retrieve

#### getAll()

Returns all settings

##### Returns

Returns all settings as array of `[string, Setting_t]`

#### set<Type>(name: string, value: Type)

Sets a setting. Changes will be saved to disk immediately. Also, the frontend receives an update event.

##### Parameters

`name: string` - the setting name. Is assumed to be unique  
`value: Type` - the setting type

#### registerSettingUpdateEvent(preferenceName: string, f: (value: any) => void)

Registers an event listener. This callback is called when the particular setting is updated. Any backend system can register an event listener.

##### Parameters

`preferenceName: string` - the name of the setting. Is assumed to be unique  
`f: (value: any) => void` - the callback function

#### IPC: 'projectSettings:open'

Opens the project settings window

#### IPC: 'projectSettings:changed'

Updates the setting identified by uuid.

##### Parameters

`uuid: string` - the uuid (v4) used to identify the setting. This setting can be nested.  
`value: value_t` - the setting value

#### IPC: 'projectSettings:request'

Returns the setting identified by name

##### Parameters

`name: string` -  the setting name. Is assumed to be unique

#### IPC: 'projectSettings:request-all'

Returns all settings as array of `[string, Setting_t]`

#### IPC: 'app:quit'

Saves the settings to the filesystem

## Build Dialog

<!-- are settings persistent?
where do they come from?
 -->


## Settings Types

Settings generally can have any serializable type. If developers want to expose settings to the UI, they have to manually write the according functionality. However, if the setting is of type `Setting_t`, UI can be automatically generated. This is particularly useful for Unity package configurations.

`Setting_t` is a union type of `StringSetting`, `BoolSetting`, `IntSetting`, `FloatSetting`, `PathSetting`, `DropdownSetting`, `CompositeSetting`, and `ListSetting`. All settings of type `Setting_t` must have the properties `label`, `uuid`, `kind`, and `value`.

| Property  | Description  | Example Value |
|---|---|---|
| label | The `string` to use as label in the UI  | 'Test Setting'  |
| uuid | The uuidv4 used to identify this setting. `string` value | '0dd6c339-f8f5-4539-96d8-0a1110c83074' |
| kind | Denominator property. Must be either 'string', 'boolean', 'int', 'float', 'path', 'dropdown', 'composite', or 'list' | 'composite' |

| Setting          | value type                                       | Example                                                         |
|------------------|----------------------------------------------------|-----------------------------------------------------------------|
| StringSetting    | `string`                                             | 'Test'                                                          |
| BoolSetting      | `string`                                             | 'true'                                                          |
| IntSetting       | `string`                                             | '42'                                                            |
| FloatSetting     | `string`                                             | '3.41'                                                          |
| PathSetting      | `string`                                             | 'C:\Program Files\Unity\Hub\Editor\2021.2.0f1\Editor\Unity.exe' |
| DropdownSetting  | `string`                                             | 'apples'                                                        |
| CompositeSetting | `{ [key: string]: Setting }`                         | [see packageRegistries in example preferences](https://gitlab2.informatik.uni-wuerzburg.de/GE/Teaching/grl/2021-truman-viavr-editor/-/blob/master/code/res/preferences.json)                                                                |
| ListSetting      | `string[] | number[] | { [key: string]: Setting }[]` | `['a', 'b', 'c']`                                                            |


Furthermore, some settings can have additional properties.


| Setting         | Property | Description                                                               | Example                       |
|-----------------|----------|---------------------------------------------------------------------------|-------------------------------|
| IntSetting      | `min`      | The minimal number. Optional propery. String value.                       | '0'                           |
| IntSetting      | `max`      | The minimal number. Optional propery. String value.                       | '10'                          |
| FloatSetting    | `min`      | The minimal number. Optional propery. String value.                       | '1.0'                         |
| FloatSetting    | `max`      | The minimal number. Optional propery. String value.                       | '10.0'                        |
| DropdownSetting | `options`  | Array of string. Represents all available values to choose from. Required.          | ['apples', 'peas', 'bananas'] |
| ListSetting     | `listType` | The type of list. Must be either 'string', 'int', 'float', or 'composite'. Required. | 'composite'                   |

### TLTR: Example Settings File

```json
{
  "testDropdown": {
    "value": "Option A",
    "label": "Test Dropdown",
    "uuid": "0482051a-7f1e-45e7-80f9-1f7b2694e86c",
    "kind": "dropdown",
    "options": [
      "Option A",
      "Option B",
      "Option C"
    ]
  },
  "testPath": {
    "value": "C:\\Program Files\\Unity\\Hub\\Editor\\2021.2.0f1\\Editor\\Unity.exe",
    "label": "Test Path",
    "uuid": "803139a9-52c6-4f64-9a6e-34d303f066ca",
    "kind": "path"
  },
  "testString": {
    "value": "helloWorld",
    "kind": "string",
    "uuid": "988ed853-0da3-49cf-8fe1-9556fe3ab1b0",
    "label": "Test String"
  },
  "testfloat": {
    "value": "8.6",
    "kind": "float",
    "uuid": "b8917070-2014-490b-8749-32c287b2a5f3",
    "label": "Test Float",
    "min": "1",
    "max": "10"
  },
  "testInt": {
    "value": "6.3",
    "kind": "int",
    "uuid": "2f3376b9-87ea-47e7-b0ac-33af583c70c4",
    "label": "Test Int",
    "min": "1",
    "max": "10"
  },
  "testBool": {
    "value": "true",
    "uuid": "5182e600-271d-4981-aae4-3d2c70c748cb",
    "kind": "boolean",
    "label": "Test Bool"
  },
  "compositeTest": {
    "value": {
      "testDropdown": {
        "value": "Option A",
        "label": "Test Dropdown",
        "uuid": "db79e91a-abfa-4142-88ee-d9d391ffb8e2",
        "kind": "dropdown",
        "options": [
          "Option A",
          "Option B",
          "Option C"
        ]
      },
      "testPath": {
        "value": "C:\\Program Files\\Unity\\Hub\\Editor\\2021.2.0f1\\Editor\\Unity.exe",
        "label": "Test Path",
        "uuid": "e7e6f7a6-a0e8-4eae-85b2-628f136d523e",
        "kind": "path"
      },
      "testString": {
        "value": "helloWorld",
        "uuid": "d9d9b343-d8f8-4d25-8561-ff16c078ce41",
        "kind": "string",
        "label": "Test String"
      },
      "testfloat": {
        "value": "8.6",
        "kind": "float",
        "uuid": "a746d319-bec5-4f30-8b7d-6926adee1001",
        "label": "Test Float",
        "min": "1",
        "max": "10"
      },
      "testInt": {
        "value": "6.3",
        "kind": "int",
        "uuid": "6ff3fa0a-6e09-43d4-b140-4a67388efa48",
        "label": "Test Int",
        "min": "1",
        "max": "10"
      },
      "testBool": {
        "value": "true",
        "uuid": "c8619443-bf1e-4849-a142-fd18c6ed7a06",
        "kind": "boolean",
        "label": "Test Bool"
      }
    },
    "kind": "composite",
    "uuid": "699bcfb3-7a1a-4e29-9397-ef1cb2027e0b",
    "label": "Test Composite"
  },
  "StringListTest": {
    "value": ["hello", "world"],
    "uuid": "a247e07e-5698-4b97-aced-2b88448589de",
    "kind": "list",
    "listType": "string",
    "label": "Test String List"
  },
  "IntListTest": {
    "value": ["1", "2", "3"],
    "uuid": "d4d1e50a-ebdc-4fcd-ac2b-372b5cb6298f",
    "kind": "list",
    "listType": "int",
    "label": "Test int List"
  },
  "FloatListTest": {
    "value": ["1.1", "2.2", "3.5"],
    "uuid": "65ca054e-95e1-42b3-a704-33126b433b69",
    "kind": "list",
    "listType": "float",
    "label": "Test float List"
  },
  "CompositeListTest": {
    "value": [
      {
        "testDropdown": {
          "value": "Option A",
          "label": "Test Dropdown",
          "uuid": "db79e91a-abfa-4142-88ee-d9d391ffb8e21",
          "kind": "dropdown",
          "options": [
            "Option A",
            "Option B",
            "Option C"
          ]
        },
        "testPath": {
          "value": "C:\\Program Files\\Unity\\Hub\\Editor\\2021.2.0f1\\Editor\\Unity.exe",
          "label": "Test Path",
          "uuid": "e7e6f7a6-a0e8-4eae-85b2-628f136d523e2",
          "kind": "path"
        },
        "testString": {
          "value": "helloWorld",
          "uuid": "d9d9b343-d8f8-4d25-8561-ff16c078ce413",
          "kind": "string",
          "label": "Test String"
        },
        "testfloat": {
          "value": "8.6",
          "kind": "float",
          "uuid": "a746d319-bec5-4f30-8b7d-6926adee10014",
          "label": "Test Float",
          "min": "1",
          "max": "10"
        },
        "testInt": {
          "value": "6.3",
          "kind": "int",
          "uuid": "6ff3fa0a-6e09-43d4-b140-4a67388efa485",
          "label": "Test Int",
          "min": "1",
          "max": "10"
        },
        "testBool": {
          "value": "true",
          "uuid": "c8619443-bf1e-4849-a142-fd18c6ed7a066",
          "kind": "boolean",
          "label": "Test Bool"
        }
      },
      {
        "testDropdown": {
          "value": "Option A",
          "label": "Test Dropdown",
          "uuid": "db79e91a-abfa-4142-88ee-d9d391ffb8e27",
          "kind": "dropdown",
          "options": [
            "Option A",
            "Option B",
            "Option C"
          ]
        },
        "testPath": {
          "value": "C:\\Program Files\\Unity\\Hub\\Editor\\2021.2.0f1\\Editor\\Unity.exe",
          "label": "Test Path",
          "uuid": "e7e6f7a6-a0e8-4eae-85b2-628f136d523e11",
          "kind": "path"
        },
        "testString": {
          "value": "helloWorld",
          "uuid": "d9d9b343-d8f8-4d25-8561-ff16c078ce4122",
          "kind": "string",
          "label": "Test String"
        },
        "testfloat": {
          "value": "8.6",
          "kind": "float",
          "uuid": "a746d319-bec5-4f30-8b7d-6926adee100133",
          "label": "Test Float",
          "min": "1",
          "max": "10"
        },
        "testInt": {
          "value": "6.3",
          "kind": "int",
          "uuid": "6ff3fa0a-6e09-43d4-b140-4a67388efa4844",
          "label": "Test Int",
          "min": "1",
          "max": "10"
        },
        "testBool": {
          "value": "true",
          "uuid": "c8619443-bf1e-4849-a142-fd18c6ed7a0655",
          "kind": "boolean",
          "label": "Test Bool"
        }
      }
    ],
    "uuid": "39371f06-d133-42ec-af03-dd0cecc0c86f",
    "kind": "list",
    "listType": "composite",
    "label": "Test composite List"
  },
  "dev.viavr.editor.version": "0.1.0-development"
}
```

## Frontend

<!-- Add most important API functions? -->
<!-- mention callbacks/events -->