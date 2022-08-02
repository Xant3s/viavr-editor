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
