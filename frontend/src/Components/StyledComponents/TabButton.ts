import styled from 'styled-components'

export const TabButton = styled.button`
  display: inline-block;
  background: #006eff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 12px;
  font-family: inherit;
 

  &:hover {
    background: #0550b3;
  }

  &:active {
    transform: scale(0.98);
    background: #0550b3;
  }

  &:focus {
    outline: none;
    background: #0550b3;
  }
  
  &:focus-within{
    outline: none;
    background: #0550b3;
  }
  
  &:disabled {
    background: darkgray;
  }
`