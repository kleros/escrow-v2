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
  isPreview: boolean;
}

const PreviewCard: React.FC<IPreviewCard> = ({
  escrowType,
  escrowTitle,
  deliverableText,
  receivingQuantity,
  receivingToken,
  receivingRecipientAddress,
  sendingQuantity,
  sendingToken,
  sendingRecipientAddress,
  deadlineDate,
  tokenSymbol,
  overrideIsList,
  extraDescriptionUri,
  buyer,
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
        overrideIsList={overrideIsList}
        isPreview={true}
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
    <EscrowTimeline isPreview={isPreview} />
  </StyledCard>
);

export default PreviewCard;
