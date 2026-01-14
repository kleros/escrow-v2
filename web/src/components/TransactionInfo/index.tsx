import React from "react";
import { Copiable } from "@kleros/ui-components-library";
import { useEnsName } from "wagmi";
import Skeleton from "react-loading-skeleton";
import { Statuses } from "consts/statuses";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "consts/chains";
import { useIsList } from "context/IsListProvider";
import { shortenAddress } from "utils/shortenAddress";
import CalendarIcon from "svgs/icons/calendar.svg";
import PileCoinsIcon from "svgs/icons/pile-coins.svg";
import UserIcon from "svgs/icons/user.svg";
import Field from "./Field";
import { cn } from "src/utils";

const aStyle =
  "text-klerosUIComponentsPrimaryText font-semibold hover:underline hover:text-klerosUIComponentsPrimaryBlue";

export interface ITransactionInfo {
  amount?: string;
  deadline: number;
  assetSymbol?: string;
  status?: Statuses;
  overrideIsList?: boolean;
  isPreview?: boolean;
  sellerAddress?: string;
  buyerAddress?: string;
}

const TransactionInfo: React.FC<ITransactionInfo> = ({
  amount,
  assetSymbol,
  deadline,
  sellerAddress,
  buyerAddress,
  overrideIsList,
  isPreview,
}) => {
  const { isList } = useIsList();
  const displayAsList = isList && !overrideIsList;

  const { data: buyerEns } = useEnsName({
    address: buyerAddress as `0x${string}`,
    chainId: 1,
  });
  const { data: sellerEns } = useEnsName({
    address: sellerAddress as `0x${string}`,
    chainId: 1,
  });

  const displayBuyerAddress = buyerEns || shortenAddress(buyerAddress ?? "");
  const displaySellerAddress = sellerEns || shortenAddress(sellerAddress ?? "");

  return (
    <div className={cn("flex flex-col gap-2 w-full justify-center", displayAsList && "lg:gap-0 lg:h-full lg:flex-1")}>
      <div
        className={cn(
          "flex flex-col gap-2 justify-center items-center w-full h-full",
          isPreview && "flex-row flex-wrap justify-start gap-y-4 gap-x-8",
          displayAsList &&
            !isPreview && [
              "lg:flex-row lg:flex-wrap lg:gap-y-2 lg:gap-x-8",
              "lg:justify-between lg:self-end lg:items-center",
              "lg:w-auto lg:h-auto lg:max-w-[360px] lg:mr-9",
            ]
        )}
      >
        {amount ? (
          <Field
            icon={PileCoinsIcon}
            name="Amount"
            value={
              <>
                {amount} {!assetSymbol ? <Skeleton width={30} /> : assetSymbol}
              </>
            }
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {deadline ? (
          <Field
            icon={CalendarIcon}
            name="Delivery Deadline"
            value={new Date(deadline).toLocaleString()}
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {buyerAddress ? (
          <Field
            icon={UserIcon}
            name="Buyer"
            value={
              isPreview ? (
                <Copiable
                  copiableContent={buyerAddress ?? ""}
                  info="Copy Buyer Address"
                  tooltipProps={{
                    small: true,
                  }}
                >
                  <a
                    className={aStyle}
                    href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${buyerAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayBuyerAddress}
                  </a>
                </Copiable>
              ) : (
                displayBuyerAddress
              )
            }
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
        {sellerAddress ? (
          <Field
            icon={UserIcon}
            name="Seller"
            value={
              isPreview ? (
                <Copiable
                  copiableContent={sellerAddress ?? ""}
                  info="Copy Seller Address"
                  tooltipProps={{
                    small: true,
                  }}
                >
                  <a
                    className={aStyle}
                    href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${sellerAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displaySellerAddress}
                  </a>
                </Copiable>
              ) : (
                displaySellerAddress
              )
            }
            displayAsList={displayAsList}
            isPreview={isPreview}
          />
        ) : null}
      </div>
    </div>
  );
};

export default TransactionInfo;
