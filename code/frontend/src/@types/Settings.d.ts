export interface Setting {
    label: string,
    kind: string
}

export interface StringSetting extends Setting {
    value: string
}

export interface BoolSetting extends Setting {
    value: string
}

export interface IntSetting extends Setting {
    value: string
}

export interface FloatSetting extends Setting {
    value: string
}

export interface PathSetting extends Setting {
    value: string
}

export interface DropdownSetting extends Setting {
    value: string,
    options: string[]
}

export interface CompositeSetting extends Setting {
    value: { [key: string]: Setting }
}

export interface ListSetting extends Setting {
    value: string[] | number[] | Setting[]
}
