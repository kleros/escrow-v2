import React from "react";

import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";

import AttachedFile from "./AttachedFile";
import Description from "./Description";
import Header from "./Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${landscapeStyle(
    () => css`
        gap: 24px;
    `
  )}
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
  deadline: number;
  assetSymbol: string;
  extraDescriptionUri: string;
  buyer: string;
}

const Terms: React.FC<ITerms> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  buyerAddress,
  sendingQuantity,
  sellerAddress,
  deadline,
  assetSymbol,
  extraDescriptionUri,
}) => {
  return (
    <Container>
      <Header />
      <Description
        {...{
          escrowType,
          deliverableText,
          receivingQuantity,
          buyerAddress,
          sendingQuantity,
          sellerAddress,
          deadline,
          assetSymbol,
        }}
      />
      <AttachedFile {...{ extraDescriptionUri }} />
    </Container>
  );
};
export default Terms;
