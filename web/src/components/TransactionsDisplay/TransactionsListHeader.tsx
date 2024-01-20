import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const TransactionsData = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(4, ${responsiveSize(100, 130, 900)});
  column-gap: ${responsiveSize(2, 12, 900)};
  justify-content: space-around;
  text-align: end;
`;

const TransactionTitle = styled.div`
  display: none;
  width: ${responsiveSize(270, 345, 900)};
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
        <label>Delivery Deadline</label>
      </TransactionsData>
    </Container>
  );
};

export default TransactionsListHeader;
