import React from "react";
import { useWindowSize } from "react-use";
import { useParams, useNavigate } from "react-router-dom";
// import { DisputeDetailsFragment, Dispute_Filter, OrderDirection } from "src/graphql/graphql";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
// import { useCasesQuery } from "queries/useCasesQuery";
// import { useCounterQuery, CounterQuery } from "queries/useCounter";
// import { useCourtDetails, CourtDetailsQuery } from "queries/useCourtDetails";
import { decodeURIFilter, useRootPath } from "utils/uri";
import { isUndefined } from "utils/index";
import TransactionsDisplay from "components/TransactionsDisplay";

const transactions = [
  {
    arbitrated: { id: "0x17f65c4f99942003a4f8d3d898f96ff4830d44b2" },
    court: {
      id: "91",
      policy: "/ipfs/Qm0794b9efbb9600b0ed7d15090ca6fd6aeac80375e405/General-Court-Policy.json",
      feeForJuror: "20113633900822",
      timesPerStatus: [3, 5, 5, 4],
    },
    id: "0",
    lastStatusChange: "1527687314",
    status: "inProgress",
  },
  {
    arbitrated: { id: "0x196fbc6fa0cbe847254c854654f15a9c4a3ba77c" },
    court: {
      id: "57",
      policy: "/ipfs/Qm7722346a5987498901023948b41d9aa62d9370e368f4/General-Court-Policy.json",
      feeForJuror: "70647742084361",
      timesPerStatus: [8, 6, 10, 4],
    },
    id: "1",
    lastStatusChange: "1589007989",
    status: "concluded",
  },
  {
    arbitrated: { id: "0x165a90355d3e59013eaee3c5eb38865cf257b9f8" },
    court: {
      id: "51",
      policy: "/ipfs/Qm7d8a49c63d8ed414b852b814806f18f85b4560285cca/General-Court-Policy.json",
      feeForJuror: "27347712140665",
      timesPerStatus: [5, 4, 3, 9],
    },
    id: "2",
    lastStatusChange: "1571895681",
    status: "concluded",
  },
  {
    arbitrated: { id: "0x9b14cee59bcdf4252be093653dd0715466fbc96a" },
    court: {
      id: "27",
      policy: "/ipfs/Qmbfa544b0e39857c463a99c3b8a0663e0faf54acd0883/General-Court-Policy.json",
      feeForJuror: "98627890858017",
      timesPerStatus: [1, 5, 10, 3],
    },
    id: "3",
    lastStatusChange: "1537822348",
    status: "settlement",
  },
  {
    arbitrated: { id: "0x819cbb7be10532f6775491c7ceca653e7db01183" },
    court: {
      id: "20",
      policy: "/ipfs/Qm99743f3b911f5d1493cf5e924fe204dd54928e71c514/General-Court-Policy.json",
      feeForJuror: "65582830742884",
      timesPerStatus: [3, 5, 1, 10],
    },
    id: "4",
    lastStatusChange: "1653973971",
    status: "disputed",
  },
  {
    arbitrated: { id: "0x4ec9aa2e56b0a5eb5c585f53a69a99b3e0dbcc9c" },
    court: {
      id: "85",
      policy: "/ipfs/Qme5a658378f45ff59dc3f6fef2241f8b253bf25011fdb/General-Court-Policy.json",
      feeForJuror: "61263765290208",
      timesPerStatus: [1, 7, 5, 2],
    },
    id: "5",
    lastStatusChange: "1548793471",
    status: "disputed",
  },
  {
    arbitrated: { id: "0x498418e20b547008fbba26ee392e636c0b8166f8" },
    court: {
      id: "38",
      policy: "/ipfs/Qm1767f6ce36a5eba45e055b78935d1572ad6e04e1635b/General-Court-Policy.json",
      feeForJuror: "85346977370669",
      timesPerStatus: [10, 9, 1, 9],
    },
    id: "6",
    lastStatusChange: "1600459039",
    status: "concluded",
  },
  {
    arbitrated: { id: "0xaaeaba6e11937990d3b76c96ecfaea7a60f7d10c" },
    court: {
      id: "38",
      policy: "/ipfs/Qm5e39669ca7f7b7bd08204d8bd56ef42992a8ba0e7e7a/General-Court-Policy.json",
      feeForJuror: "85666599189715",
      timesPerStatus: [5, 5, 6, 1],
    },
    id: "7",
    lastStatusChange: "1617122023",
    status: "settlement",
  },
  {
    arbitrated: { id: "0x5b2564dbd1d25f8798fabf1de8571ba4c04d5d01" },
    court: {
      id: "64",
      policy: "/ipfs/Qmf80b9aebcdfd34b6fe69f799fc022c39c7b043316096/General-Court-Policy.json",
      feeForJuror: "12045763392410",
      timesPerStatus: [8, 10, 3, 8],
    },
    id: "8",
    lastStatusChange: "1659368740",
    status: "inProgress",
  },
  {
    arbitrated: { id: "0x0a503b7d5ed7a39fceda3f7b9b882b0c2d558e89" },
    court: {
      id: "49",
      policy: "/ipfs/Qm6d2d2ff0f56de8ee841ed6cdab30a222ff44cdf764d9/General-Court-Policy.json",
      feeForJuror: "13506217935957",
      timesPerStatus: [6, 6, 5, 3],
    },
    id: "9",
    lastStatusChange: "1509708908",
    status: "disputed",
  },
];

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

  return (
    <TransactionsDisplay
      transactions={transactions}
      numberTransactions={10}
      currentPage={pageNumber}
      setCurrentPage={(newPage: number) => navigate(`${location}/${newPage}/${order}/${filter}`)}
      totalPages={2}
      transactionsPerPage={transactionsPerPage}
    />
  );
};

export default TransactionsFetcher;
