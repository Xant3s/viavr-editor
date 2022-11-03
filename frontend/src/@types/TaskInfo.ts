import {ConditionInfo} from './ConditionInfo'
import {ActionInfo} from './ActionInfo'

export class TaskInfo {
    identifier: string = ''
    description: string = ''
    conditions: ConditionInfo[] = []
    actions: ActionInfo[] = []
}
