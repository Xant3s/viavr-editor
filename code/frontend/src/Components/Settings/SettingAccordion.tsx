import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import {SettingAccordion as StyledAccordion} from '../StyledComponents/Preferences/StyledSettings'
import AccordionDetails from '@mui/material/AccordionDetails'

export const SettingAccordion = ({summary, details}) => {
    return (
        <StyledAccordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{summary}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{details}</Typography>
            </AccordionDetails>
        </StyledAccordion>
    )
}
