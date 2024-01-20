import { Statuses } from "consts/statuses";

export const mapStatusToEnum = (status: string) => {
  switch (status) {
    case "NoDispute":
      return Statuses.inProgress;
    case "DisputeCreated":
      return Statuses.disputed;
    case "TransactionResolved":
      return Statuses.concluded;
    case "WaitingBuyer":
      return Statuses.waitingBuyer;
    case "WaitingSeller":
      return Statuses.waitingSeller;
    default:
      return Statuses.inProgress;
  }
};
