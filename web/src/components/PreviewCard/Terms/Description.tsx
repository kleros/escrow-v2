import React from "react";
import MarkdownRenderer from "components/MarkdownRenderer";
import { Copiable } from "@kleros/ui-components-library";
import { useEnsName } from "wagmi";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "consts/chains";
import { isUndefined } from "utils/index";
import { shortenAddress } from "utils/shortenAddress";
import Skeleton from "react-loading-skeleton";

const copiableStyle = "mr-0.5 gap-1.5";
const aStyle = "text-klerosUIComponentsPrimaryBlue text-base hover:underline";

interface IDescription {
  escrowType: string;
  deliverableText: string;
  receivingQuantity: string;
  receivingToken: string;
  buyerAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sellerAddress: string;
  deadline: number;
  assetSymbol: string;
  buyer: string;
}

const Description: React.FC<IDescription> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  receivingToken,
  buyerAddress,
  sendingQuantity,
  sendingToken,
  sellerAddress,
  deadline,
  assetSymbol,
}) => {
  const { data: buyerEns } = useEnsName({
    address: buyerAddress as `0x${string}`,
    chainId: 1,
  });
  const { data: sellerEns } = useEnsName({
    address: sellerAddress as `0x${string}`,
    chainId: 1,
  });

  const displayBuyerAddress = buyerEns || shortenAddress(buyerAddress);
  const displaySellerAddress = sellerEns || shortenAddress(sellerAddress);

  const generalEscrowSummary = (
    <div className="flex flex-col gap-4">
      <div>
        By Paying {sendingQuantity}{" "}
        <span className="inline-block">{assetSymbol ? assetSymbol : <Skeleton className="z-0" width={30} />}</span>,
        address{" "}
        <Copiable className={copiableStyle} copiableContent={buyerAddress ?? ""} info="Copy Buyer Address">
          <a
            className={aStyle}
            href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${buyerAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayBuyerAddress}
          </a>
        </Copiable>{" "}
        should receive:
      </div>

      <MarkdownRenderer
        className="inline [&_p]:inline [&_a]:text-base [&_code]:text-klerosUIComponentsSecondaryText"
        content={deliverableText}
      />

      <div>
        from address{" "}
        <Copiable className={copiableStyle} copiableContent={sellerAddress ?? ""} info="Copy Seller Address">
          <a
            className={aStyle}
            href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${sellerAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displaySellerAddress}
          </a>
        </Copiable>{" "}
        before the delivery deadline {new Date(deadline).toString()}.
      </div>
    </div>
  );

  const cryptoSwapSummary = (
    <>
      By Paying {sendingQuantity} {sendingToken}, [Blockchain] address{" "}
      <Copiable className={copiableStyle} copiableContent={buyerAddress ?? ""} info="Copy Buyer Address">
        <a
          className={aStyle}
          href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${buyerAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displayBuyerAddress}
        </a>
      </Copiable>{" "}
      should receive {receivingQuantity} {receivingToken} at the [Blockchain] address{" "}
      <Copiable className={copiableStyle} copiableContent={sellerAddress ?? ""} info="Copy Seller Address">
        <a
          className={aStyle}
          href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${sellerAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displaySellerAddress}
        </a>
      </Copiable>{" "}
      from [Blockchain] address TODO before the delivery deadline {new Date(deadline).toString()}.
    </>
  );

  return isUndefined(deliverableText) ? (
    <Skeleton className="z-0" />
  ) : (
    <div className="flex flex-col gap-4">
      <div className="text-klerosUIComponentsPrimaryText m-0 wrap-break-word">
        {escrowType === "general" ? generalEscrowSummary : cryptoSwapSummary}
      </div>
      <p className="m-0 wrap-break-word">
        After the delivery deadline, you can start a complaint (propose a settlement or raise a dispute). In case of a
        dispute, it will be arbitrated by the Kleros Freelancing Court.
      </p>
    </div>
  );
};

export default Description;
