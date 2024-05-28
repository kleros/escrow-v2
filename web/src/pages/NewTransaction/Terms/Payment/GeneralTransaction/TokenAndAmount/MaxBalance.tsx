import React from "react";
import { landscapeStyle } from "styles/landscapeStyle";
import styled, { css } from "styled-components";
import Skeleton from "react-loading-skeleton";
import { isUndefined } from "utils/index";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  gap: 4px;

  ${landscapeStyle(
    () => css`
      align-self: flex-end;
    `
  )}
`;

const LabelAndBalance = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const Label = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 12px;
`;

const Balance = styled.p`
  margin: 0;
  font-size: 12px;
`;

const BalanceSkeleton = styled(Skeleton)`
  width: 63px;
  height: 16px;
`;

const MaxButton = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.primaryBlue};
  font-size: 12px;
  cursor: pointer;
`;

interface IMaxBalance {
  formattedBalance: string;
  rawBalance: number;
  setQuantity: (value: string) => void;
}

const MaxBalance: React.FC<IMaxBalance> = ({ formattedBalance, rawBalance, setQuantity }) => {
  return (
    <Container>
      <LabelAndBalance>
        <Label>Balance:</Label>
        {isUndefined(formattedBalance) ? <BalanceSkeleton /> : <Balance>{formattedBalance}</Balance>}
      </LabelAndBalance>
      {!isUndefined(formattedBalance) ? (
        <MaxButton onClick={() => setQuantity(String(rawBalance))}>Max</MaxButton>
      ) : null}
    </Container>
  );
};
export default MaxBalance;
