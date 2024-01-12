import React from "react";
import styled from "styled-components";
import Search from "./Search";
import StatsAndFilters from "./StatsAndFilters";
import TransactionsGrid, { ITransactionsGrid } from "./TransactionsGrid";
import { responsiveSize } from "styles/responsiveSize";
import { TransactionDetailsFragment } from "src/graphql/graphql";

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: ${responsiveSize(20, 24)} 0;
`;

const StyledTitle = styled.h1`
  margin-bottom: ${responsiveSize(32, 48)};
`;

interface ITransactionsDisplay extends ITransactionsGrid {
  transactions?: TransactionDetailsFragment[];
  totalTransactions?: number;
  resolvedTransactions?: number;
  title?: string;
  className?: string;
}

const TransactionsDisplay: React.FC<ITransactionsDisplay> = ({
  transactions,
  currentPage,
  setCurrentPage,
  totalTransactions,
  resolvedTransactions,
  transactionsPerPage,
  title = "My Transactions",
  className,
  totalPages,
}) => {
  return (
    <div {...{ className }}>
      <StyledTitle>{title}</StyledTitle>
      <Search />
      <StatsAndFilters totalTransactions={totalTransactions ?? 0} resolvedTransactions={resolvedTransactions ?? 0} />
      <Divider />

      {transactions?.length === 0 ? (
        <h1>No transactions found</h1>
      ) : (
        <TransactionsGrid
          transactions={transactions}
          {...{
            transactionsPerPage,
            totalPages,
            currentPage,
            setCurrentPage,
          }}
        />
      )}
    </div>
  );
};

export default TransactionsDisplay;
