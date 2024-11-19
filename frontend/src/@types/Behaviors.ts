export class Variable {
    name = ''
    type = ''
    value = ''
}

export class Event {
    displayName = ''
    description = ''
    name = ''
    id = 0
    parameters: Parameter[] = []
    actionSequence: [] = []
}

export class Meta {
    uuid = ''
    name = ''
    tags: string[] = []
    index = 0
}

export class Parameter {
    name = ''
    type = ''
    value = ''
}

export class Action {
    displayName = ''
    name = ''
    parameters: Parameter[] = []
}

export class IfElse {
    variable = ''
    variabletype = ''
    operator = ''
    comparison = ''
    then: [] = []
    else: [] = []
}

export const eventTypes =
    {
        "OnGrab": {
            "parameters": []
        },
        "OnCollisionEnter": {
            "parameters": []
        },
        "OnPlayerTrigger": {
            "parameters": []
        },
        "OnTimeElapsed": {
            "parameters": [
                {
                    name: "time",
                    type: "number",
                    value: "0"
                }
            ]
        },
        "OnTimeElapsedRepeating": [
            {
                name: "time",
                type: "number",
                value: "0"
            }
        ]
    }