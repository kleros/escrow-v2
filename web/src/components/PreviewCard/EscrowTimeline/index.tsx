import React from "react";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";
import { DisputeRequest, HasToPayFee, Payment, SettlementProposal, TransactionResolved } from "src/graphql/graphql";

interface IEscrowTimeline {
  isPreview: boolean;
  transactionCreationTimestamp: number;
  transactionHash: string;
  status: string;
  assetSymbol: string;
  isNativeTransaction: boolean;
  tokenDecimals?: number;
  buyerAddress: string;
  sellerAddress: string;
  payments: Payment[];
  settlementProposals: SettlementProposal[];
  hasToPayFees: HasToPayFee[];
  disputeRequest: DisputeRequest;
  resolvedEvents: TransactionResolved[];
  feeTimeout: number;
  settlementTimeout: number;
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({
  isPreview,
  transactionCreationTimestamp,
  transactionHash,
  status,
  assetSymbol,
  isNativeTransaction,
  tokenDecimals,
  buyerAddress,
  sellerAddress,
  payments,
  settlementProposals,
  hasToPayFees,
  disputeRequest,
  resolvedEvents,
  feeTimeout,
  settlementTimeout,
}) => {
  const items = useEscrowTimelineItems(
    isPreview,
    transactionCreationTimestamp,
    transactionHash,
    status,
    assetSymbol,
    isNativeTransaction,
    buyerAddress,
    sellerAddress,
    payments,
    settlementProposals,
    hasToPayFees,
    disputeRequest,
    resolvedEvents,
    feeTimeout,
    settlementTimeout,
    tokenDecimals,
  );

  return <CustomTimeline className="w-full" items={items} />;
};

export default EscrowTimeline;
