import React from "react";
import styled from "styled-components";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import PreviewCard from "components/PreviewCard";
import { responsiveSize } from "styles/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { useAccount } from "wagmi";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 ${responsiveSize(24, 136)};
`;

const Preview: React.FC = () => {
  const {
    escrowType,
    deliverableText,
    receivingQuantity,
    receivingToken,
    sellerAddress,
    sendingQuantity,
    sendingToken,
    escrowTitle,
    deadline,
    extraDescriptionUri,
  } = useNewTransactionContext();
  const nativeTokenSymbol = useNativeTokenSymbol();

  const { address } = useAccount();

  return (
    <Container>
      <Header />
      <PreviewCard
        receivingQuantity={receivingQuantity}
        receivingToken={receivingToken}
        sellerAddress={sellerAddress}
        sendingQuantity={sendingQuantity}
        sendingToken={""}
        buyerAddress={address}
        escrowType={escrowType}
        deliverableText={deliverableText}
        tokenSymbol={escrowType === "general" ? nativeTokenSymbol : sendingToken}
        deadlineDate={new Date(deadline).toLocaleString()}
        overrideIsList={false}
        escrowTitle={escrowTitle}
        extraDescriptionUri={extraDescriptionUri}
        isPreview={true}
      />
      <NavigationButtons prevRoute="/newTransaction/notifications" nextRoute="/newTransaction/deliverable" />
    </Container>
  );
};

export default Preview;
