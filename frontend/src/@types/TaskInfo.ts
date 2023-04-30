import {ConditionInfo} from './ConditionInfo'
import {ActionInfo} from './ActionInfo'

export class TaskInfo {
    identifier = ''
    description = ''
    conditions: ConditionInfo[] = []
    actions: ActionInfo[] = []
}
