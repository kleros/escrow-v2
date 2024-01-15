import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Card } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import Header from "./Header";
import TransactionInfo from "components/TransactionInfo";
import Terms from "./Terms";
import EscrowTimeline from "./EscrowTimeline";

export const StyledCard = styled(Card)`
  height: auto;
  min-height: 100px;
  width: 86vw;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: ${responsiveSize(24, 32)};
  padding-bottom: 52px;

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
  receivingRecipientAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sendingRecipientAddress: string;
  deadlineDate: Date;
  tokenSymbol: string;
  overrideIsList: boolean;
  extraDescriptionUri: string;
  buyer: string;
  timestamp: string;
  isPreview: boolean;
}

const PreviewCard: React.FC<IPreviewCard> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  receivingToken,
  receivingRecipientAddress,
  sendingRecipientAddress,
  sendingQuantity,
  sendingToken,
  escrowTitle,
  tokenSymbol,
  deadlineDate,
  overrideIsList,
  extraDescriptionUri,
  buyer,
  timestamp,
  isPreview,
}) => (
  <StyledCard>
    <Header escrowType={escrowType} escrowTitle={escrowTitle} />
    <TransactionInfoContainer>
      <Divider />
      <TransactionInfo
        amount={sendingQuantity}
        token={tokenSymbol}
        receiverAddress={buyer}
        deadlineDate={deadlineDate}
        isPreview={true}
        overrideIsList={overrideIsList}
      />
      <Divider />
    </TransactionInfoContainer>
    <Terms
      buyer={buyer}
      escrowType={escrowType}
      deliverableText={deliverableText}
      receivingQuantity={receivingQuantity}
      receivingToken={receivingToken}
      receivingRecipientAddress={receivingRecipientAddress}
      sendingQuantity={sendingQuantity}
      sendingToken={sendingToken}
      sendingRecipientAddress={sendingRecipientAddress}
      deadlineDate={deadlineDate}
      tokenSymbol={tokenSymbol}
      extraDescriptionUri={extraDescriptionUri}
    />
    <Divider />
    <EscrowTimeline creationTimestamp={timestamp} isPreview={isPreview} />
  </StyledCard>
);

export default PreviewCard;
