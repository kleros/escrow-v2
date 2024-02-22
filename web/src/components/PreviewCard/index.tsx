import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Card } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import Header from "./Header";
import TransactionInfo from "components/TransactionInfo";
import Terms from "./Terms";
import EscrowTimeline from "./EscrowTimeline";
import Buttons from "pages/MyTransactions/TransactionDetails/PreviewCardButtons";

export const StyledCard = styled(Card)<{ isPreview?: boolean }>`
  height: auto;
  min-height: 100px;
  width: 86vw;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: ${responsiveSize(24, 32)};

  ${({ isPreview }) =>
    isPreview &&
    css`
      padding-bottom: 36px;
    `}

  ${landscapeStyle(
    () => css`
      max-width: 100%;
    `
  )}
`;

export const Divider = styled.hr`
  display: flex;
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: 0;
`;

const TransactionInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

interface IPreviewCard {
  escrowType: string;
  escrowTitle: string;
  deliverableText: string;
  receivingQuantity: string;
  receivingToken: string;
  transactionCreationTimestamp: string;
  status: string;
  asset: string;
  buyerAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sellerAddress: string;
  deadlineDate: Date;
  tokenSymbol: string;
  overrideIsList: boolean;
  extraDescriptionUri: string;
  isPreview: boolean;
  payments: [];
  settlementProposals?: [];
  hasToPayFees?: [];
  disputeRequest?: [];
  resolvedEvents?: [];
}

const PreviewCard: React.FC<IPreviewCard> = ({
  escrowType,
  escrowTitle,
  deliverableText,
  receivingQuantity,
  receivingToken,
  transactionCreationTimestamp,
  status,
  asset,
  buyerAddress,
  sendingQuantity,
  sendingToken,
  sellerAddress,
  deadlineDate,
  tokenSymbol,
  overrideIsList,
  extraDescriptionUri,
  isPreview,
  payments,
  settlementProposals,
  hasToPayFees,
  disputeRequest,
  resolvedEvents,
}) => (
  <StyledCard isPreview={isPreview}>
    <Header escrowType={escrowType} escrowTitle={escrowTitle} />
    <TransactionInfoContainer>
      <Divider />
      <TransactionInfo
        amount={sendingQuantity}
        token={tokenSymbol}
        buyerAddress={buyerAddress}
        sellerAddress={sellerAddress}
        deadlineDate={deadlineDate}
        overrideIsList={overrideIsList}
        isPreview={true}
      />
      <Divider />
    </TransactionInfoContainer>
    <Terms
      escrowType={escrowType}
      deliverableText={deliverableText}
      receivingQuantity={receivingQuantity}
      receivingToken={receivingToken}
      buyerAddress={buyerAddress}
      sendingQuantity={sendingQuantity}
      sendingToken={sendingToken}
      sellerAddress={sellerAddress}
      deadlineDate={deadlineDate}
      tokenSymbol={tokenSymbol}
      extraDescriptionUri={extraDescriptionUri}
    />
    <Divider />
    <EscrowTimeline
      isPreview={isPreview}
      status={status}
      asset={asset}
      transactionCreationTimestamp={transactionCreationTimestamp}
      buyerAddress={buyerAddress}
      sellerAddress={sellerAddress}
      payments={payments}
      settlementProposals={settlementProposals}
      hasToPayFees={hasToPayFees}
      disputeRequest={disputeRequest}
      resolvedEvents={resolvedEvents}
    />
    {!isPreview ? (
      <Buttons
        buyerAddress={buyerAddress}
        sellerAddress={sellerAddress}
        disputeRequest={disputeRequest}
        hasToPayFees={hasToPayFees}
        resolvedEvents={resolvedEvents}
      />
    ) : null}
  </StyledCard>
);

export default PreviewCard;
