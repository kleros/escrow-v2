import React from "react";
import { useEnsAddress } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import PreviewCard from "components/PreviewCard";
import NavigationButtons from "../NavigationButtons";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { ensDomainPattern } from "utils/validateAddress";
import clsx from "clsx";

const Preview: React.FC = () => {
  const {
    escrowType,
    deliverableText,
    receivingQuantity,
    buyerAddress,
    sellerAddress,
    sendingQuantity,
    sendingToken,
    escrowTitle,
    deadline,
    extraDescriptionUri,
  } = useNewTransactionContext();
  const isNativeTransaction = sendingToken.address === "native";
  const nativeTokenSymbol = useNativeTokenSymbol();

  const { data: buyerEnsResolvedAddress } = useEnsAddress({
    enabled: ensDomainPattern.test(buyerAddress),
    name: buyerAddress,
    chainId: 1,
  });
  const { data: sellerEnsResolvedAddress } = useEnsAddress({
    enabled: ensDomainPattern.test(sellerAddress),
    name: sellerAddress,
    chainId: 1,
  });
  const resolvedBuyerAddress = buyerEnsResolvedAddress || buyerAddress;
  const resolvedSellerAddress = sellerEnsResolvedAddress || sellerAddress;

  return (
    <div className="flex flex-col items-center">
      <h1
        className={clsx(
          "m-0 mt-fluid-4-20 mb-fluid-20-24",
          "font-normal text-klerosUIComponentsSecondaryPurple text-(length:--spacing-fluid-20-24)"
        )}
      >
        Preview
      </h1>
      <PreviewCard
        buyerAddress={resolvedBuyerAddress}
        sellerAddress={resolvedSellerAddress}
        assetSymbol={isNativeTransaction ? nativeTokenSymbol : sendingToken.symbol}
        overrideIsList={false}
        isPreview={true}
        deadline={new Date(deadline).getTime()}
        {...{
          receivingQuantity,
          sendingQuantity,
          escrowType,
          deliverableText,
          escrowTitle,
          extraDescriptionUri,
        }}
      />
      <NavigationButtons prevRoute="/new-transaction/notifications" nextRoute="/new-transaction/deliverable" />
    </div>
  );
};

export default Preview;
