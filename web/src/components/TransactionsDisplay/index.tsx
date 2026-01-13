import React from "react";
import Search from "./Search";
import StatsAndFilters from "./StatsAndFilters";
import TransactionsGrid, { ITransactionsGrid } from "./TransactionsGrid";
import { TransactionDetailsFragment } from "src/graphql/graphql";

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
      <h1 className="mb-fluid-12-24 text-(length:--spacing-fluid-20-24)">{title}</h1>
      <Search />
      <StatsAndFilters totalTransactions={totalTransactions ?? 0} resolvedTransactions={resolvedTransactions ?? 0} />

      {transactions?.length === 0 ? (
        <label className="text-(length:--spacing-fluid-14-16)">No transactions found</label>
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
