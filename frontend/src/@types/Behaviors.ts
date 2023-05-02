export class TaskInfo {
    identifier = ''
    description = ''
    conditions: ConditionInfo[] = []
    actions: ActionInfo[] = []
}

export class ConditionInfo {
    identifier = ''
    parameter = ''
}

export class ActionInfo {
    identifier = ''
}
