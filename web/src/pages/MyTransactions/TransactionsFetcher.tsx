import React from "react";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import { useWindowSize } from "react-use";
import { useParams, useNavigate } from "react-router-dom";
// import { DisputeDetailsFragment, Dispute_Filter, OrderDirection } from "src/graphql/graphql";
// import { useCasesQuery } from "queries/useCasesQuery";
// import { useCounterQuery, CounterQuery } from "queries/useCounter";
// import { useCourtDetails, CourtDetailsQuery } from "queries/useCourtDetails";
import { decodeURIFilter, useRootPath } from "utils/uri";
import { isUndefined } from "utils/index";
import TransactionsDisplay from "components/TransactionsDisplay";
import { useAccount } from "wagmi";
import { useMyTransactionsQuery } from "hooks/queries/useTransactionsQuery";

// const transactions = [
//   {
//     arbitrated: { id: "0x17f65c4f99942003a4f8d3d898f96ff4830d44b2" },
//     court: {
//       id: "91",
//       policy: "/ipfs/Qm0794b9efbb9600b0ed7d15090ca6fd6aeac80375e405/General-Court-Policy.json",
//       feeForJuror: "20113633900822",
//       timesPerStatus: [3, 5, 5, 4],
//     },
//     id: "0",
//     lastStatusChange: "1527687314",
//     status: "inProgress",
//   },
//   {
//     arbitrated: { id: "0x196fbc6fa0cbe847254c854654f15a9c4a3ba77c" },
//     court: {
//       id: "57",
//       policy: "/ipfs/Qm7722346a5987498901023948b41d9aa62d9370e368f4/General-Court-Policy.json",
//       feeForJuror: "70647742084361",
//       timesPerStatus: [8, 6, 10, 4],
//     },
//     id: "1",
//     lastStatusChange: "1589007989",
//     status: "concluded",
//   },
//   {
//     arbitrated: { id: "0x165a90355d3e59013eaee3c5eb38865cf257b9f8" },
//     court: {
//       id: "51",
//       policy: "/ipfs/Qm7d8a49c63d8ed414b852b814806f18f85b4560285cca/General-Court-Policy.json",
//       feeForJuror: "27347712140665",
//       timesPerStatus: [5, 4, 3, 9],
//     },
//     id: "2",
//     lastStatusChange: "1571895681",
//     status: "concluded",
//   },
// ];

interface ITransactionsFetcher {}

const TransactionsFetcher: React.FC<ITransactionsFetcher> = () => {
  const { page, order, filter } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useRootPath();
  const screenIsBig = width > BREAKPOINT_LANDSCAPE;
  const transactionsPerPage = screenIsBig ? 9 : 3;
  const pageNumber = parseInt(page ?? "1");
  const decodedFilter = decodeURIFilter(filter ?? "all");
  const { address } = useAccount();
  const { data: escrowData } = useMyTransactionsQuery(address!);
  console.log("escrows", escrowData?.escrows);

  return !isUndefined(escrowData) ? (
    <TransactionsDisplay
      transactions={escrowData.escrows}
      numberTransactions={escrowData.escrows.length}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={Math.ceil(escrowData.escrows.length / transactionsPerPage)}
      transactionsPerPage={transactionsPerPage}
    />
  ) : null;
};

export default TransactionsFetcher;
