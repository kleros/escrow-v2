import React, { useMemo } from "react";
import styled from "styled-components";
import { useWindowSize } from "react-use";
import { useParams } from "react-router-dom";
import { SkeletonTransactionCard, SkeletonTransactionListItem } from "../StyledSkeleton";
import { StandardPagination } from "@kleros/ui-components-library";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useIsList } from "context/IsListProvider";
import { isUndefined } from "utils/index";
import { decodeURIFilter } from "utils/uri";
// import { TransactionDetailsFragment } from "queries/useCasesQuery";
import TransactionCard from "components/TransactionCard";
import TransactionsListHeader from "./TransactionsListHeader";

const GridContainer = styled.div`
  --gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, max(348px, (100% - var(--gap) * 2)/3)), 1fr));
  align-items: center;
  gap: var(--gap);
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const StyledPagination = styled(StandardPagination)`
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
`;

export interface ITransactionsGrid {
  transactions?: [];
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
  const screenIsBig = useMemo(() => width > BREAKPOINT_LANDSCAPE, [width]);

  return (
    <>
      {isList && screenIsBig ? (
        <ListContainer>
          <TransactionsListHeader />
          {isUndefined(transactions)
            ? [...Array(transactionsPerPage)].map((_, i) => <SkeletonTransactionListItem key={i} />)
            : transactions.map((transaction) => {
                return <TransactionCard key={transaction.id} {...transaction} />;
              })}
        </ListContainer>
      ) : (
        <GridContainer>
          {isUndefined(transactions)
            ? [...Array(transactionsPerPage)].map((_, i) => <SkeletonTransactionCard key={i} />)
            : transactions.map((transaction) => {
                return <TransactionCard key={transaction.id} {...transaction} overrideIsList />;
              })}
        </GridContainer>
      )}

      {isUndefined(searchValue) ? (
        <StyledPagination
          currentPage={currentPage}
          numPages={Math.ceil(totalPages ?? 0)}
          callback={(page: number) => setCurrentPage(page)}
        />
      ) : null}
    </>
  );
};

export default TransactionsGrid;
