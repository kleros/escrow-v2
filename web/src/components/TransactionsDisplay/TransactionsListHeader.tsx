import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
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

  ${landscapeStyle(
    () =>
      css`
        display: flex;
      `
  )}
`;

const TransactionsListHeader: React.FC = () => {
  return (
    <Container>
      <TransactionTitle>
        <label>#</label>
        <label>Title</label>
      </TransactionTitle>
      <TransactionsData>
        <label>Amount</label>
        <label>Receiver</label>
        <label>Next Deadline</label>
      </TransactionsData>
    </Container>
  );
};

export default TransactionsListHeader;
