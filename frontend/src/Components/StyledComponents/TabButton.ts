import styled from 'styled-components'

export const TabButton = styled.button`
  display: inline-block;
  background: #1A1A1A;
  color: #A8A8A8;
  border: none;
  padding-top: 5px;
  padding-right: 15px;
  padding-bottom: 5px;
  padding-left: 20px;
  margin: 3px;
  cursor: pointer;
  text-decoration: none;
  font-size: 12px;
  font-family: inherit;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
 

  &:hover {
    background: #4D535B;
    color: #FFFFFF;
  }

  &:active {
    transform: scale(1.02);
    background: #4D535B;
    color: #FFFFFF;
  }

  &:focus {
    outline: none;
    background: #4D535B;
  }
  
  &:focus-within{
    outline: none;
    background: #4D535B;
  }
  
  &:disabled {
    background: #1A1A1A;
  }
`