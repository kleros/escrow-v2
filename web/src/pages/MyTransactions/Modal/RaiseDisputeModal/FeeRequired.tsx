import React from "react";
import { Card } from "@kleros/ui-components-library";
import styled from "styled-components";
import { formatEther } from "viem";
import { StyledP } from "components/StyledTags";

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

const StyledHeader = styled(StyledP)`
  font-size: 14px;
  margin: 0;
  color: ${({ theme }) => theme.primaryBlue};
`;

const StyledQuantity = styled(StyledP)`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.primaryBlue};
  font-weight: 600;
`;

interface IFeeRequired {
  arbitrationCost: bigint;
}

const FeeRequired: React.FC<IFeeRequired> = ({ arbitrationCost }) => {
  return (
    <StyledCard>
      <StyledHeader>Arbitration fee required</StyledHeader>
      {arbitrationCost ? <StyledQuantity>{formatEther(arbitrationCost)} ETH</StyledQuantity> : null}
    </StyledCard>
  );
};
export default FeeRequired;
