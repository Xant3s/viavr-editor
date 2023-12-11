import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { SettingAccordion as StyledAccordion } from '../StyledComponents/Preferences/StyledSettings'
import { SettingAccordionMeta as StyledAccordionMeta } from '../StyledComponents/Preferences/StyledSettings'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Box, IconButton } from '@mui/material'
import {CrossIcon} from 'evergreen-ui'

export const SettingAccordion = ({ summary, details }) => {
    return (
        <StyledAccordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
            >
                <Typography>{summary}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {details}
            </AccordionDetails>
        </StyledAccordion>
    )
}

export const SettingAccordionMeta = ({ summary, details, onClose}) => {

    return (
        <StyledAccordionMeta style={{width:'500px'}}>
            <Box style={{ display: 'flex', alignItems: 'center' , borderBottom:'solid', borderColor:'#4D535B', borderWidth:'2px'}}>
                <AccordionSummary
                    expandIcon={
                        <ExpandMoreIcon style={{color: 'white'}}/> 
                }
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    style={{flexGrow: 3}}
                >
                <div>  <Typography>{summary}</Typography> </div>
                </AccordionSummary>
                <Box>
                    <IconButton style={{paddingLeft:'0'}}>
                        <CrossIcon style={{color:'white'}} onClick={() => onClose()} />
                    </IconButton>
                </Box>
            </Box>            
            <AccordionDetails>
                {details}
            </AccordionDetails>
            
        </StyledAccordionMeta>
    )
}
