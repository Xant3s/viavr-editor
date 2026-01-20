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
  z-index: 10000;
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

// Styled components for Articy overlay (external window open state)
export const ArticyOverlayBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ArticyOverlayContent = styled.div`
  background: linear-gradient(135deg, rgba(58, 64, 72, 0.95) 0%, rgba(45, 50, 58, 0.98) 100%);
  padding: 40px 50px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 420px;

  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ArticyOverlayIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

export const ArticyOverlayTitle = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

export const ArticyOverlayDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
`;

export const ArticyOverlaySpinner = styled.div`
  width: 24px;
  height: 24px;
  margin: 20px auto 0;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
