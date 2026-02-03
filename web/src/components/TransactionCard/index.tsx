import React from "react";

import { Card } from "@kleros/ui-components-library";
import { formatETH, formatTokenAmount } from "utils/format";

import { useIsList } from "context/IsListProvider";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import { isUndefined } from "utils/index";

import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { useTokenMetadata } from "hooks/useTokenMetadata";

import { TransactionDetailsFragment } from "src/graphql/graphql";

import TransactionInfo from "../TransactionInfo";
import StatusBanner from "./StatusBanner";
import Skeleton from "react-loading-skeleton";

const TruncatedTitle = ({ text, maxLength }) => {
  const truncatedText = text.length <= maxLength ? text : text.slice(0, maxLength) + "…";
  return <h3 className="m-0 text-klerosUIComponentsPrimaryText font-semibold">{truncatedText}</h3>;
};

interface ITransactionCard extends TransactionDetailsFragment {
  overrideIsList?: boolean;
}

const TransactionCard: React.FC<ITransactionCard> = ({
  id,
  status,
  overrideIsList,
  transactionUri,
  deadline,
  seller,
  buyer,
  amount,
  token,
}) => {
  const transactionInfo = useFetchIpfsJson(transactionUri);
  const { isList } = useIsList();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { tokenMetadata } = useTokenMetadata(token);
  const erc20TokenSymbol = tokenMetadata?.symbol;
  const tokenDecimals = tokenMetadata?.decimals;
  const assetSymbol = token ? erc20TokenSymbol : nativeTokenSymbol;
  const title = transactionInfo?.title;
  const navigateAndScrollTop = useNavigateAndScrollTop();
  const formattedAmount = token ? formatTokenAmount(amount, tokenDecimals) : formatETH(amount);

  const currentStatusEnum = mapStatusToEnum(status);

  return (
    <>
      {!isList || overrideIsList ? (
        <Card className="w-full h-[260px]" hover onClick={() => navigateAndScrollTop(`/transactions/${id.toString()}`)}>
          <StatusBanner id={parseInt(id)} status={currentStatusEnum} />
          <div className="flex flex-col justify-between h-[calc(100%-45px)] py-5 px-4 lg:px-6">
            {!isUndefined(title) ? (
              <h3 className="m-0 text-klerosUIComponentsPrimaryText font-semibold line-clamp-3">{title}</h3>
            ) : (
              <Skeleton className="z-0" />
            )}
            <TransactionInfo
              amount={formattedAmount}
              buyerAddress={buyer}
              sellerAddress={seller}
              deadlineDate={new Date(deadline * 1000).toLocaleString()}
              isPreview={false}
              {...{ assetSymbol }}
            />
          </div>
        </Card>
      ) : (
        <Card
          className="flex grow w-full h-[82px]"
          hover
          onClick={() => navigateAndScrollTop(`/transactions/${id.toString()}`)}
        >
          <StatusBanner isCard={false} id={parseInt(id)} status={currentStatusEnum} />
          <div className="flex items-center w-full">
            {!isUndefined(title) ? (
              <div>
                <TruncatedTitle text={title} maxLength={50} />
              </div>
            ) : (
              <Skeleton className="ml-[92px]" width={200} />
            )}
            <TransactionInfo
              amount={formattedAmount}
              buyerAddress={buyer}
              sellerAddress={seller}
              deadlineDate={new Date(deadline * 1000).toLocaleString()}
              isPreview={false}
              {...{ assetSymbol }}
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default TransactionCard;
