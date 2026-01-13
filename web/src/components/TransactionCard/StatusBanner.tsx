import React from "react";
import { Statuses } from "consts/statuses";
import { cn, isUndefined } from "utils/index";

const borderStyles: Record<Statuses, string> = {
  [Statuses.inProgress]: "border-klerosUIComponentsPrimaryBlue",
  [Statuses.settlementWaitingBuyer]: "border-klerosUIComponentsWarning",
  [Statuses.settlementWaitingSeller]: "border-klerosUIComponentsWarning",
  [Statuses.raisingDisputeWaitingBuyer]: "border-klerosUIComponentsWarning",
  [Statuses.raisingDisputeWaitingSeller]: "border-klerosUIComponentsWarning",
  [Statuses.disputed]: "border-klerosUIComponentsSecondaryPurple",
  [Statuses.concluded]: "border-klerosUIComponentsSuccess",
};

const bgStyles: Record<Statuses, string> = {
  [Statuses.inProgress]: "bg-klerosUIComponentsMediumBlue",
  [Statuses.settlementWaitingBuyer]: "bg-klerosUIComponentsWarningLight",
  [Statuses.settlementWaitingSeller]: "bg-klerosUIComponentsWarningLight",
  [Statuses.raisingDisputeWaitingBuyer]: "bg-klerosUIComponentsWarningLight",
  [Statuses.raisingDisputeWaitingSeller]: "bg-klerosUIComponentsWarningLight",
  [Statuses.disputed]: "bg-klerosUIComponentsMediumPurple",
  [Statuses.concluded]: "bg-klerosUIComponentsSuccessLight",
};

const dotAndFrontColorStyles: Record<Statuses, string> = {
  [Statuses.inProgress]:
    "[&_.front-color]:text-klerosUIComponentsPrimaryBlue [&_.dot::before]:bg-klerosUIComponentsPrimaryBlue",
  [Statuses.settlementWaitingBuyer]:
    "[&_.front-color]:text-klerosUIComponentsWarning [&_.dot::before]:bg-klerosUIComponentsWarning",
  [Statuses.settlementWaitingSeller]:
    "[&_.front-color]:text-klerosUIComponentsWarning [&_.dot::before]:bg-klerosUIComponentsWarning",
  [Statuses.raisingDisputeWaitingBuyer]:
    "[&_.front-color]:text-klerosUIComponentsWarning [&_.dot::before]:bg-klerosUIComponentsWarning",
  [Statuses.raisingDisputeWaitingSeller]:
    "[&_.front-color]:text-klerosUIComponentsWarning [&_.dot::before]:bg-klerosUIComponentsWarning",
  [Statuses.disputed]:
    "[&_.front-color]:text-klerosUIComponentsSecondaryPurple [&_.dot::before]:bg-klerosUIComponentsSecondaryPurple",
  [Statuses.concluded]: "[&_.front-color]:text-klerosUIComponentsSuccess [&_.dot::before]:bg-klerosUIComponentsSuccess",
};

const getStatusLabel = (status: Statuses): string => {
  switch (status) {
    case Statuses.inProgress:
      return "In Progress";
    case Statuses.settlementWaitingBuyer:
      return "Settlement - Waiting Buyer";
    case Statuses.settlementWaitingSeller:
      return "Settlement - Waiting Seller";
    case Statuses.raisingDisputeWaitingBuyer:
      return "Raising a Dispute - Waiting Buyer";
    case Statuses.raisingDisputeWaitingSeller:
      return "Raising a Dispute - Waiting Seller";
    case Statuses.disputed:
      return "Disputed";
    case Statuses.concluded:
      return "Concluded";
    default:
      return "";
  }
};

export interface IStatusBanner {
  id?: number;
  status: Statuses;
  isCard?: boolean;
  isPreview?: boolean;
}

const StatusBanner: React.FC<IStatusBanner> = ({ id, status, isCard = true, isPreview = false }) => {
  return (
    <div
      className={cn(
        "flex items-center rounded-tr-[3px] rounded-tl-[3px]",
        isCard ? "h-[45px] justify-between" : "h-full justify-start",
        isPreview ? "p-0 border-none bg-transparent h-auto" : "py-0 px-6",
        !isPreview &&
          (isCard
            ? ["border-t-[5px]", borderStyles[status], bgStyles[status]]
            : ["bg-transparent border-l-[5px]", borderStyles[status]]),
        "[&_.dot::before]:content-[''] [&_.dot::before]:h-2 [&_.dot::before]:w-2 [&_.dot::before]:rounded-full [&_.dot::before]:mr-2",
        !isUndefined(status)
          ? dotAndFrontColorStyles[status]
          : "[&_.front-color]:text-klerosUIComponentsLightGrey [&_.dot::before]:bg-klerosUIComponentsLightGrey"
      )}
    >
      <label className={cn("flex items-center dot front-color", !isCard && "w-[104px]")}>
        {getStatusLabel(status)}
      </label>
      {!isUndefined(id) ? <label className={cn("flex items-center front-color", !isCard && "w-8")}>#{id}</label> : null}
    </div>
  );
};

export default StatusBanner;
