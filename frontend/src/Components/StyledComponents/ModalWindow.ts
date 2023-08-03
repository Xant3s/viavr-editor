import styled from "styled-components";

// Styled component for the modal background
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Dark grey semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Styled component for the modal content
export const ModalContent = styled.div`
  background-color: #3a4048;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

// Styled component for the modal title
export const ModalTitle = styled.h2`
  color: white;
`;

// Styled component for the modal buttons container
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
