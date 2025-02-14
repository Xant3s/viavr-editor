import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { SettingAccordion as StyledAccordion } from '../StyledComponents/Preferences/StyledSettings'
import { SettingAccordionEvent as StyledAccordionEvent } from '../StyledComponents/Preferences/StyledSettings'
import AccordionDetails from '@mui/material/AccordionDetails'
import {CrossIcon} from 'evergreen-ui'
import { Box, IconButton } from '@mui/material'
import React from 'react';
import { SettingAccordionMeta as StyledAccordionMeta } from '../StyledComponents/Preferences/StyledSettings'

export const SettingAccordion = ({ summary, details }) => {
    return (
        <StyledAccordion>
            <AccordionSummary
                expandIcon={
                <ExpandMoreIcon style={{ color: 'white' }} />
                }
                aria-controls='panel1a-content'
                id='panel1a-header'
            >
              <div>  <Typography>{summary}</Typography> </div>
            </AccordionSummary>
            <AccordionDetails>
                {details}
            </AccordionDetails>
            
        </StyledAccordion>
    )
}

export const SettingAccordionEvent = ({ summary, details, onClose}) => {


    return (
        <StyledAccordionEvent style={{width:'500px'}}>
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
            
        </StyledAccordionEvent>
    )
}

export const SettingAccordionAction = ({ summary, details, onClose }) => {

    return (
        <StyledAccordion style={{width:'95%', border:'solid', borderColor: '#6C737A'}}>
            <Box style={{ display: 'flex', alignItems: 'center', borderBottom:'solid', borderColor:'#6C737A', borderWidth:'2px'}}>
                <AccordionSummary

                    expandIcon={<ExpandMoreIcon style={{color: 'white'}}/>}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    style={{flexGrow: 1}}
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
