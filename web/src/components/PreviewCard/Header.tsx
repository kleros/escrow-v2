import React from "react";
import { isUndefined } from "utils/index";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import StatusBanner from "../TransactionCard/StatusBanner";
import Skeleton from "react-loading-skeleton";
import { Statuses } from "~src/consts/statuses";

interface IHeader {
  escrowType: string;
  escrowTitle?: string;
  status: string;
}

const Header: React.FC<IHeader> = ({ escrowType, escrowTitle, status }) => {
  const currentStatusEnum = mapStatusToEnum(status) ?? Statuses.inProgress;

  return (
    <div className="flex flex-wrap justify-between gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-klerosUIComponentsSecondaryPurple">
          {escrowType === "general" ? "General Escrow" : "Crypto Swap"}
        </label>
        {isUndefined(escrowTitle) ? (
          <Skeleton className="z-0" />
        ) : (
          <h1 className="m-0 wrap-break-word w-full text-(length:--spacing-fluid-20-24)">{escrowTitle}</h1>
        )}
      </div>
      <div className="flex items-center gap-4 lg:shrink-0 lg:gap-y-0 lg:gap-x-fluid-24-32-900">
        <StatusBanner status={currentStatusEnum} isPreview={true} />
      </div>
    </div>
  );
};

export default Header;
