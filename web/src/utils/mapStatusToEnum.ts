import { Statuses } from "consts/statuses";

export const mapStatusToEnum = (status: string) => {
  switch (status) {
    case "NoDispute":
      return Statuses.inProgress;
    case "WaitingSettlementBuyer":
      return Statuses.settlementWaitingBuyer;
    case "WaitingSettlementSeller":
      return Statuses.settlementWaitingSeller;
    case "WaitingBuyer":
      return Statuses.raisingDisputeWaitingBuyer;
    case "WaitingSeller":
      return Statuses.raisingDisputeWaitingSeller;
    case "DisputeCreated":
      return Statuses.disputed;
    case "TransactionResolved":
      return Statuses.concluded;
    default:
      return Statuses.inProgress;
  }
};
