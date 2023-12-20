import React from "react";
import { Card } from "@kleros/ui-components-library";
import styled from "styled-components";

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mediumBlue};
  height: 87px;
  width: 100%;
  border: none;
  justify-content: center;
  align-items: center;
  padding: 15px;
  gap: 5px;
`;

const StyledHeader = styled.p`
  font-size: 14px;
  margin: 0;
  color: ${({ theme }) => theme.primaryBlue};
`;

const StyledQuantity = styled.p`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.primaryBlue};
  font-weight: 600;
`;

const FeeRequired: React.FC = () => {
  return (
    <StyledCard>
      <StyledHeader>Arbitration fee required</StyledHeader>
      <StyledQuantity>0.001 ETH</StyledQuantity>
    </StyledCard>
  );
};
export default FeeRequired;
