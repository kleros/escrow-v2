import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useRootPath, decodeURIFilter } from "utils/uri";
import { useAccount } from "wagmi";
import { useMyTransactionsQuery } from "hooks/queries/useTransactionsQuery";
import TransactionsDisplay from "components/TransactionsDisplay";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useUserQuery } from "hooks/queries/useUserQuery";
import { isUndefined } from "utils/index";
import { TransactionDetailsFragment } from "~src/graphql/graphql";

const TransactionsFetcher: React.FC = () => {
  const { page, order, filter } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useRootPath();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;
  const transactionsPerPage = screenIsBig ? 9 : 3;
  const pageNumber = parseInt(page ?? "1", 10);
  const transactionSkip = transactionsPerPage * (pageNumber - 1);
  const { address } = useAccount();

  const { data: escrowData } = useMyTransactionsQuery(address!, transactionsPerPage, transactionSkip);
  console.log(escrowData);

  const { data: userData } = useUserQuery(address);
  const totalEscrows = userData?.user?.totalEscrows;
  const totalPages = useMemo(
    () => (!isUndefined(totalEscrows) ? Math.ceil(totalEscrows / transactionsPerPage) : 1),
    [totalEscrows, transactionsPerPage]
  );

  return (
    <TransactionsDisplay
      transactions={escrowData?.escrows as TransactionDetailsFragment[]}
      totalTransactions={totalEscrows}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={totalPages}
      transactionsPerPage={transactionsPerPage}
    />
  );
};

export default TransactionsFetcher;
