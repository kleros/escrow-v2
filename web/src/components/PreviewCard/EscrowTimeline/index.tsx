import React from "react";
import styled from "styled-components";
import { CustomTimeline } from "@kleros/ui-components-library";
import useEscrowTimelineItems from "hooks/useEscrowTimelineItems";
import { DisputeRequest, HasToPayFee, Payment, SettlementProposal, TransactionResolved } from "src/graphql/graphql";

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
`;

interface IEscrowTimeline {
  isPreview: boolean;
  transactionCreationTimestamp: number;
  status: boolean;
  assetSymbol: string;
  buyerAddress: string;
  sellerAddress: string;
  payments: Payment[];
  settlementProposals: SettlementProposal[];
  hasToPayFees: HasToPayFee[];
  disputeRequest: DisputeRequest;
  resolvedEvents: TransactionResolved[];
}

const EscrowTimeline: React.FC<IEscrowTimeline> = ({
  isPreview,
  transactionCreationTimestamp,
  status,
  assetSymbol,
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
    status,
    assetSymbol,
    buyerAddress,
    sellerAddress,
    payments,
    settlementProposals,
    hasToPayFees,
    disputeRequest,
    resolvedEvents,
    feeTimeout,
    settlementTimeout
  );

  return <StyledTimeline items={items} />;
};

export default EscrowTimeline;
