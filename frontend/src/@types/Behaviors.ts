export class TaskInfo {
    identifier = ''
    description = ''
    conditions: ConditionInfo[] = []
    actions: ActionInfo[] = []
}

export class ConditionInfo {
    identifier = ''
    description = ''
}

export class ActionInfo {
    identifier = ''
}
