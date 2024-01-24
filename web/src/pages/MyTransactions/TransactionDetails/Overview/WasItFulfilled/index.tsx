import React from "react";
import styled, { css } from "styled-components";
import { Card } from "@kleros/ui-components-library";
import Buttons from "./Buttons";
import Header from "./Header";
import { landscapeStyle } from "styles/landscapeStyle";

const StyledCard = styled(Card)`
  display: flex;
  gap: 32px;
  background-color: ${({ theme }) => theme.mediumBlue};
  border: 1px solid ${({ theme }) => theme.primaryBlue};
  width: 86vw;
  height: auto;
  align-items: center;
  align-self: center;
  justify-content: center;
  flex-direction: column;
  padding: 32px 40px 51px 40px;

  ${landscapeStyle(
    () =>
      css`
        padding-bottom: 36px;
        height: 157px;
        gap: 22px;
        width: 100%;
      `
  )}
`;

const WasItFulfilled: React.FC = () => {
  return (
    <StyledCard>
      <Header />
      <Buttons />
    </StyledCard>
  );
};
export default WasItFulfilled;
