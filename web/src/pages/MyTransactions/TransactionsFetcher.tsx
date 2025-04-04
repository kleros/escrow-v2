import React, { useMemo } from "react";

import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";

import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useAccount } from "wagmi";

import { DEFAULT_CHAIN } from "consts/chains";
import { useRootPath, decodeURIFilter } from "utils/uri";

import { useMyTransactionsQuery } from "queries/useTransactionsQuery";
import { useUserQuery } from "queries/useUserQuery";
import { OrderDirection, TransactionDetailsFragment } from "src/graphql/graphql";

import TransactionsDisplay from "components/TransactionsDisplay";
import ConnectWallet from "components/ConnectWallet";
import { ConnectWalletContainer } from "./index";
import { StyledHr } from "components/StyledTags";

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
  const { data: userData } = useUserQuery(address);
  const decodedFilter = decodeURIFilter(filter ?? "all");
  const { data: escrowData } = useMyTransactionsQuery(
    address!,
    transactionsPerPage,
    transactionSkip,
    decodedFilter,
    order === "asc" ? OrderDirection.Asc : OrderDirection.Desc
  );
  const { isConnected, chain } = useAccount();
  const isOnSupportedChain = chain?.id === DEFAULT_CHAIN;

  const { totalTransactions, totalConcludedTransactions } = useMemo(() => {
    switch (decodedFilter.status) {
      case "DisputeCreated":
        return {
          totalTransactions: userData?.user?.totalDisputedEscrows,
          totalConcludedTransactions: 0,
        };
      case "TransactionResolved":
        return {
          totalTransactions: userData?.user?.totalResolvedEscrows,
          totalConcludedTransactions: userData?.user?.totalResolvedEscrows,
        };
      case "NoDispute":
        return {
          totalTransactions: userData?.user?.totalNoDisputedEscrows,
          totalConcludedTransactions: 0,
        };
      case "WaitingBuyer":
        return {
          totalTransactions: userData?.user?.totalWaitingBuyerEscrows,
          totalConcludedTransactions: 0,
        };
      case "WaitingSeller":
        return {
          totalTransactions: userData?.user?.totalWaitingSellerEscrows,
          totalConcludedTransactions: 0,
        };
      default:
        return {
          totalTransactions: userData?.user?.totalEscrows,
          totalConcludedTransactions: userData?.user?.totalResolvedEscrows,
        };
    }
  }, [userData, decodedFilter]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalTransactions / transactionsPerPage) || 1;
  }, [totalTransactions, transactionsPerPage]);

  return isConnected && isOnSupportedChain ? (
    <TransactionsDisplay
      transactions={escrowData?.escrows as TransactionDetailsFragment[]}
      totalTransactions={totalTransactions}
      resolvedTransactions={totalConcludedTransactions}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={totalPages}
      transactionsPerPage={transactionsPerPage}
    />
  ) : (
    <ConnectWalletContainer>
      To see your transactions, connect first and switch to the supported chain
      <StyledHr />
      <ConnectWallet />
    </ConnectWalletContainer>
  );
};

export default TransactionsFetcher;
