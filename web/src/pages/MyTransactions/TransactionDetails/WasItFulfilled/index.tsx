import React from "react";
import styled, { css } from "styled-components";
import { Card } from "@kleros/ui-components-library";
import Buttons from "./Buttons";
import Header from "./Header";
import { landscapeStyle } from "styles/landscapeStyle";

const StyledCard = styled(Card)`
  display: flex;
  gap: 22px;
  background-color: ${({ theme }) => theme.mediumBlue};
  border: 1px solid ${({ theme }) => theme.primaryBlue};
  width: 100%;
  height: auto;
  align-items: center;
  align-self: center;
  flex-direction: column;
  padding: 30px 40px 4px 40px;

  ${landscapeStyle(
    () =>
      css`
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
