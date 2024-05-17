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
  buyerAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sellerAddress: string;
  deadlineDate: Date;
  assetSymbol: string;
  extraDescriptionUri: string;
  buyer: string;
}

const Terms: React.FC<ITerms> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  receivingToken,
  buyerAddress,
  sendingQuantity,
  sendingToken,
  sellerAddress,
  deadlineDate,
  assetSymbol,
  extraDescriptionUri,
}) => {
  return (
    <Container>
      <Header />
      <Description
        escrowType={escrowType}
        deliverableText={deliverableText}
        receivingQuantity={receivingQuantity}
        receivingToken={receivingToken}
        buyerAddress={buyerAddress}
        sendingQuantity={sendingQuantity}
        sendingToken={sendingToken}
        sellerAddress={sellerAddress}
        deadlineDate={deadlineDate}
        assetSymbol={assetSymbol}
      />
      <AttachedFile extraDescriptionUri={extraDescriptionUri} />
    </Container>
  );
};
export default Terms;
