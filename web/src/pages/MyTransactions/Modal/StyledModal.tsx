import styled from "styled-components";

export const StyledModal = styled.div`
  display: flex;
  position: fixed;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  max-height: 80vh;
  overflow-y: auto;

  z-index: 10;
  flex-direction: column;
  align-items: center;
  width: 86vw;
  max-width: 600px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.stroke};
  background-color: ${({ theme }) => theme.whiteBackground};
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.06);
  padding: 32px 32px 32px 36px;
`;
