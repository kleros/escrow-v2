import React, { useMemo } from "react";
import { useWindowSize } from "react-use";
import { useParams } from "react-router-dom";
import { StandardPagination } from "@kleros/ui-components-library";
import { useIsList } from "context/IsListProvider";
import { isUndefined } from "utils/index";
import { decodeURIFilter } from "utils/uri";
import TransactionCard from "components/TransactionCard";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import clsx from "clsx";
import { LG_BREAKPOINT } from "src/styles/breakpoints";
import Skeleton from "react-loading-skeleton";

export interface ITransactionsGrid {
  transactions?: TransactionDetailsFragment[];
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  transactionsPerPage: number;
  totalPages: number;
}

const TransactionsGrid: React.FC<ITransactionsGrid> = ({
  transactions,
  transactionsPerPage,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const { filter } = useParams();
  const decodedFilter = decodeURIFilter(filter ?? "all");
  const { id: searchValue } = decodedFilter;
  const { isList } = useIsList();
  const { width } = useWindowSize();
  const screenIsBig = useMemo(() => width > LG_BREAKPOINT, [width]);

  return (
    <>
      {isList && screenIsBig ? (
        <div className="flex flex-col justify-center gap-2">
          {isUndefined(transactions)
            ? [...Array(transactionsPerPage)].map((_, i) => <Skeleton key={i} height={80} />)
            : transactions.map((transaction) => {
                return <TransactionCard key={transaction.id} {...transaction} />;
              })}
        </div>
      ) : (
        <div
          className={clsx(
            "grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(312px,(100%-16px*2)/3)),1fr))]",
            "gap-4 items-center"
          )}
        >
          {isUndefined(transactions)
            ? [...Array(transactionsPerPage)].map((_, i) => <Skeleton key={i} className="w-full h-fluid-270-296" />)
            : transactions.map((transaction) => {
                return <TransactionCard key={transaction.id} {...transaction} overrideIsList />;
              })}
        </div>
      )}

      {isUndefined(searchValue) ? (
        <StandardPagination
          className="mt-6 mx-auto"
          currentPage={currentPage}
          numPages={Math.ceil(totalPages ?? 0)}
          callback={(page: number) => setCurrentPage(page)}
        />
      ) : null}
    </>
  );
};

export default TransactionsGrid;
