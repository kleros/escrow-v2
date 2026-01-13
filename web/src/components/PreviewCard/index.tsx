import React from "react";
import { Card } from "@kleros/ui-components-library";
import Header from "./Header";
import TransactionInfo from "components/TransactionInfo";
import Terms from "./Terms";
import EscrowTimeline from "./EscrowTimeline";
import PreviewCardButtons from "pages/MyTransactions/TransactionDetails/PreviewCardButtons";
import { DisputeRequest, HasToPayFee, Payment, SettlementProposal, TransactionResolved } from "src/graphql/graphql";
import clsx from "clsx";

const dividerStyle = "flex border-none h-px bg-klerosUIComponentsStroke m-0";

interface IPreviewCard {
  escrowType: string;
  escrowTitle: string;
  deliverableText: string;
  receivingQuantity: string;
  transactionCreationTimestamp: string;
  status: string;
  transactionHash: string;
  buyerAddress: string;
  sendingQuantity: string;
  sellerAddress: string;
  deadline: number;
  assetSymbol: string;
  overrideIsList: boolean;
  extraDescriptionUri: string;
  isPreview: boolean;
  payments: Payment[];
  settlementProposals?: SettlementProposal[];
  hasToPayFees?: HasToPayFee[];
  disputeRequest?: DisputeRequest;
  resolvedEvents?: TransactionResolved[];
  feeTimeout: number;
  settlementTimeout: number;
  arbitrationCost: bigint;
}

const PreviewCard: React.FC<IPreviewCard> = ({
  escrowType,
  escrowTitle,
  deliverableText,
  receivingQuantity,
  transactionCreationTimestamp,
  status,
  transactionHash,
  buyerAddress,
  sendingQuantity,
  sellerAddress,
  deadline,
  assetSymbol,
  overrideIsList,
  extraDescriptionUri,
  isPreview,
  payments,
  settlementProposals,
  hasToPayFees,
  disputeRequest,
  resolvedEvents,
  feeTimeout,
  settlementTimeout,
  arbitrationCost,
}) => (
  <Card className={clsx("flex flex-col gap-4 lg:gap-6", "w-full h-auto p-4 pt-5 lg:p-8", isPreview && "pb-9")}>
    <Header {...{ escrowType, escrowTitle, status, transactionHash, isCard: false }} />
    <div className="flex flex-col gap-6">
      <hr className={dividerStyle} />
      <TransactionInfo
        amount={sendingQuantity}
        isPreview={true}
        {...{ overrideIsList, deadline, sellerAddress, buyerAddress, assetSymbol }}
      />
      <hr className={dividerStyle} />
    </div>
    <Terms
      {...{
        escrowType,
        deliverableText,
        receivingQuantity,
        buyerAddress,
        sendingQuantity,
        sellerAddress,
        deadline,
        assetSymbol,
        extraDescriptionUri,
      }}
    />
    <hr className={dividerStyle} />
    <EscrowTimeline
      {...{
        isPreview,
        status,
        assetSymbol,
        transactionCreationTimestamp,
        buyerAddress,
        sellerAddress,
        payments,
        settlementProposals,
        hasToPayFees,
        disputeRequest,
        resolvedEvents,
        feeTimeout,
        settlementTimeout,
      }}
    />
    {!isPreview ? <PreviewCardButtons {...{ feeTimeout, settlementTimeout, arbitrationCost }} /> : null}
  </Card>
);

export default PreviewCard;
