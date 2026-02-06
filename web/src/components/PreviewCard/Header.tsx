import React from "react";
import { SUPPORTED_CHAINS, DEFAULT_CHAIN } from "consts/chains";
import { isUndefined } from "utils/index";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import StatusBanner from "../TransactionCard/StatusBanner";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import Skeleton from "react-loading-skeleton";

interface IHeader {
  escrowType: string;
  escrowTitle?: string;
  id: string;
  status: string;
  transactionHash: string;
  isCard: boolean;
}

const Header: React.FC<IHeader> = ({ escrowType, escrowTitle, id, status, transactionHash, isCard }) => {
  const currentStatusEnum = mapStatusToEnum(status);
  const etherscanUrl = `${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/tx/${transactionHash}`;

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
        {transactionHash ? (
          <a href={etherscanUrl} target="_blank" rel="noreferrer">
            <EtherscanIcon width={16} height={16} />
          </a>
        ) : null}
        <StatusBanner status={currentStatusEnum} isPreview={true} />
      </div>
    </div>
  );
};

export default Header;
