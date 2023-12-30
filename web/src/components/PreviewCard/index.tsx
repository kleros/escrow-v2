import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Card } from "@kleros/ui-components-library";
import { responsiveSize } from "styles/responsiveSize";
import Header from "./Header";
import TransactionInfo from "components/TransactionInfo";
import { useNewTransactionContext } from "context/NewTransactionContext";
import Terms from "./Terms";
import EscrowTimeline from "./EscrowTimeline";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";

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

const PreviewCard: React.FC = () => {
  const { escrowType, sendingQuantity, sendingToken, sendingRecipientAddress, deadline } = useNewTransactionContext();
  const nativeTokenSymbol = useNativeTokenSymbol();

  return (
    <StyledCard>
      <Header />
      <TransactionInfoContainer>
        <Divider />
        <TransactionInfo
          amount={sendingQuantity}
          token={escrowType === "general" ? nativeTokenSymbol : sendingToken}
          receiver={sendingRecipientAddress}
          deadline={deadline}
          isPreview={true}
          overrideIsList={true}
        />
        <Divider />
      </TransactionInfoContainer>
      <Terms />
      <Divider />
      <EscrowTimeline />
    </StyledCard>
  );
};
export default PreviewCard;
