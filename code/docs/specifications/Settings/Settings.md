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
<!-- settings types for auto UI, can use any serializable type if you manage it yourself -->

## Frontend

<!-- Add most important API functions? -->
<!-- mention callbacks/events -->