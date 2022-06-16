import styled from 'styled-components'
import Accordion from '@mui/material/Accordion'

export const StyledPreferences = styled.div`
  background-color: #15171b;
  color: white;
  padding: 20px;
  height: 100vh;
`

export const PreferencesContainer = styled.div`
  background-color: #3a4048;
  margin: 30px auto;
  padding: 30px;
  border-radius: 2px;
`

export const PreferenceEntry = styled.div`
  margin-bottom: 10px;
`

export const PreferenceListEntry = styled.div`
  background: #4d535b;
  margin: 10px;
  display: flex;
  flex-direction: row;
  width: 540px;
  border-radius: 5px;
  padding: 10px;
`

export const PreferenceEntryLabel = styled.label`
  display: inline-block;
  width: 180px;
  text-align: right;
  margin-right: 10px;
`

export const PreferenceAccordion = styled(Accordion)`
  background-color: #4d535b!important;
  color: white!important;
`
