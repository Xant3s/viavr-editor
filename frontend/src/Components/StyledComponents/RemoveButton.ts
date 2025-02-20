import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
import { IconBaseProps } from 'react-icons'

export const RemoveButton = styled(FaTimes as React.ComponentType<IconBaseProps>)`
    color: white;
    cursor: pointer;
    margin-left: 20px;
    font-size: 1.5em;
`
