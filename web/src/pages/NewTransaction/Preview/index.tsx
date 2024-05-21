import React from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import PreviewCard from "components/PreviewCard";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { useERC20TokenSymbol } from "hooks/useERC20TokenSymbol";

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
  const isNativeTransaction = sendingToken === "native";
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { erc20TokenSymbol } = useERC20TokenSymbol(sendingToken);

  const { address } = useAccount();

  return (
    <Container>
      <Header />
      <PreviewCard
        buyerAddress={address}
        assetSymbol={isNativeTransaction ? nativeTokenSymbol : erc20TokenSymbol}
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
