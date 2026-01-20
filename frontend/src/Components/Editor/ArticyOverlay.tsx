import * as React from 'react'
import {
    ArticyOverlayBackdrop,
    ArticyOverlayContent,
    ArticyOverlayIcon,
    ArticyOverlayTitle,
    ArticyOverlayDescription,
    ArticyOverlaySpinner
} from '../StyledComponents/ModalWindow'
import { useTranslation } from '../../LocalizationContext'

export const ArticyOverlay = () => {
    const { translate } = useTranslation()

    return (
        <ArticyOverlayBackdrop>
            <ArticyOverlayContent>
                <ArticyOverlayIcon>
                    🎭
                </ArticyOverlayIcon>
                <ArticyOverlayTitle>
                    {translate('articyOverlay.title')}
                </ArticyOverlayTitle>
                <ArticyOverlayDescription>
                    {translate('articyOverlay.description')}
                </ArticyOverlayDescription>
                <ArticyOverlaySpinner />
            </ArticyOverlayContent>
        </ArticyOverlayBackdrop>
    )
}
