import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: calc(15vw + (40 - 15) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  width: 100%;
  height: 100%;
`;

const TransactionsData = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin-left: ${responsiveSize(0, 33)};
  flex-wrap: wrap;
  padding: 0 3%;
  gap: ${responsiveSize(24, 48, 300)};
`;

const TransactionTitle = styled.div`
  display: none;
  margin-left: 32px;
  gap: 36px;
  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    color: ${({ theme }) => theme.secondaryText} !important;
  }

  ${landscapeStyle(
    () =>
      css`
        display: flex;
      `
  )}
`;

const StyledLabel = styled.label`
  margin-left: ${responsiveSize(4, 8, 300, 900)};
`;

const TransactionsListHeader: React.FC = () => {
  return (
    <Container>
      <TransactionTitle>
        <label>#</label>
        <label>Title</label>
      </TransactionTitle>
      <TransactionsData>
        <StyledLabel>Amount</StyledLabel>
        <StyledLabel>Receiver</StyledLabel>
        <label>Next Deadline</label>
      </TransactionsData>
    </Container>
  );
};

export default TransactionsListHeader;
