import { Alert, Spinner } from 'evergreen-ui'
import { Row } from '../StyledComponents/Row'
import { FC } from 'react'


interface Props {
    hidden: boolean
    text: string
}

export const InfoSpinnerBox: FC<Props> = ({ hidden, text }) => {
    return (<>
            {
                !hidden &&
                <Alert intent='info'>
                    <Row>
                        <Spinner style={{marginRight: 10}} size={24} />
                        <div>{text}</div>
                    </Row>
                </Alert>
            }
        </>
    )
}