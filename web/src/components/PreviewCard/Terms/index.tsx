import React from "react";
import styled from "styled-components";
import AttachedFile from "./AttachedFile";
import Description from "./Description";
import Header from "./Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

interface ITerms {
  escrowType: string;
  deliverableText: string;
  receivingQuantity: string;
  receivingToken: string;
  receivingRecipientAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sendingRecipientAddress: string;
  deadlineDate: Date;
  tokenSymbol: string;
  extraDescriptionUri: string;
  buyer: string;
}

const Terms: React.FC<ITerms> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  receivingToken,
  sendingQuantity,
  sendingToken,
  sendingRecipientAddress,
  deadlineDate,
  tokenSymbol,
  extraDescriptionUri,
  buyer,
}) => {
  return (
    <Container>
      <Header />
      <Description
        buyer={buyer}
        escrowType={escrowType}
        deliverableText={deliverableText}
        receivingQuantity={receivingQuantity}
        receivingToken={receivingToken}
        receivingRecipientAddress={buyer}
        sendingQuantity={sendingQuantity}
        sendingToken={sendingToken}
        sendingRecipientAddress={sendingRecipientAddress}
        deadlineDate={deadlineDate}
        tokenSymbol={tokenSymbol}
      />
      <AttachedFile extraDescriptionUri={extraDescriptionUri} />
    </Container>
  );
};
export default Terms;
