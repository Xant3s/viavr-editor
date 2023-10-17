import styled from 'styled-components'
import Accordion from '@mui/material/Accordion'


export const Center = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const StyledSettings = styled.div`
  background-color: #15171b;
  color: white;
  padding-top: 20px;
  padding-right: 20px;
  padding-bottom: 2px;
  padding-left: 20px;
  margin-bottom: 0px;
  height: 100%;
  min-height: 100vh;
`

export const SettingsContainer = styled.div`
  background-color: #3a4048;
  margin: 30px auto;
  padding: 30px;
  border-radius: 2px;
`

export const SettingsEntry = styled.div`
  margin-bottom: 10px;
`

export const SettingListEntry = styled.div`
  background: #4d535b;
  margin: 10px;
  display: inline-flex;
  flex-direction: row;
  min-width: 80%;
  border-radius: 5px;
  padding: 5px;
`

export const SettingEntryLabel = styled.label`
  display: inline-block;
  width: 180px;
  text-align: left;
  margin-right: 10px;
`

export const SettingAccordion = styled(Accordion)`
  background-color: #4d535b!important;
  color: white!important;
`
