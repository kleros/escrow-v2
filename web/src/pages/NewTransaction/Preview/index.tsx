import React from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import PreviewCard from "components/PreviewCard";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Preview: React.FC = () => {
  const {
    escrowType,
    deliverableText,
    receivingQuantity,
    sellerAddress,
    sendingQuantity,
    sendingToken,
    escrowTitle,
    deadline,
    extraDescriptionUri,
  } = useNewTransactionContext();
  const isNativeTransaction = sendingToken.address === "native";
  const nativeTokenSymbol = useNativeTokenSymbol();

  const { address } = useAccount();

  return (
    <Container>
      <Header />
      <PreviewCard
        buyerAddress={address}
        assetSymbol={isNativeTransaction ? nativeTokenSymbol : sendingToken.symbol}
        overrideIsList={false}
        isPreview={true}
        deadline={new Date(deadline).getTime()}
        {...{
          receivingQuantity,
          sellerAddress,
          sendingQuantity,
          escrowType,
          deliverableText,
          escrowTitle,
          extraDescriptionUri,
        }}
      />
      <NavigationButtons prevRoute="/new-transaction/notifications" nextRoute="/new-transaction/deliverable" />
    </Container>
  );
};

export default Preview;
