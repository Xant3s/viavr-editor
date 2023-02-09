export type Setting_t =
    StringSetting
    | BoolSetting
    | IntSetting
    | FloatSetting
    | PathSetting
    | DropdownSetting
    | CompositeSetting
    | ListSetting
export type value_t = string | string[] | number[] | { [key: string]: Setting_t } | { [key: string]: Setting_t }[]
export type listType_t = 'string' | 'int' | 'float' | 'composite'
export const StringSetting_typeName = 'string'
export const BoolSetting_typeName = 'boolean'
export const IntSetting_typeName = 'int'
export const FloatSetting_typeName = 'float'
export const PathSetting_typeName = 'path'
export const DropdownSetting_typeName = 'dropdown'
export const CompositeSetting_typeName = 'composite'
export const ListSetting_typeName = 'list'

interface Setting {
    label: string
    uuid: string
}

export interface StringSetting extends Setting {
    value: string
    kind: 'string'
}

export interface BoolSetting extends Setting {
    value: string
    kind: 'boolean'
}

export interface IntSetting extends Setting {
    value: string
    kind: 'int'
    min: string
    max: string
}

export interface FloatSetting extends Setting {
    value: string
    kind: 'float'
    min: string
    max: string
}

export interface PathSetting extends Setting {
    value: string
    kind: 'path'
}

export interface DropdownSetting extends Setting {
    value: string
    options: string[]
    kind: 'dropdown'
}

export interface CompositeSetting extends Setting {
    value: { [key: string]: Setting }
    kind: 'composite'
}

export interface ListSetting extends Setting {
    value: string[] | number[] | { [key: string]: Setting }[]
    kind: 'list'
    listType: 'string' | 'int' | 'float' | 'composite'
}
