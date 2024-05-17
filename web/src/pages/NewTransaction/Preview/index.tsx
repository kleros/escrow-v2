import React from "react";
import styled from "styled-components";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import PreviewCard from "components/PreviewCard";
import { responsiveSize } from "styles/responsiveSize";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { useAccount } from "wagmi";
import { useERC20TokenSymbol } from "hooks/useERC20TokenSymbol";

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
    sellerAddress,
    sendingQuantity,
    sendingToken,
    escrowTitle,
    deadline,
    extraDescriptionUri,
  } = useNewTransactionContext();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { erc20TokenSymbol } = useERC20TokenSymbol(sendingToken);

  const { address } = useAccount();

  return (
    <Container>
      <Header />
      <PreviewCard
        receivingQuantity={receivingQuantity}
        sellerAddress={sellerAddress}
        sendingQuantity={sendingQuantity}
        buyerAddress={address}
        escrowType={escrowType}
        deliverableText={deliverableText}
        assetSymbol={sendingToken === "native" ? nativeTokenSymbol : erc20TokenSymbol}
        deadlineDate={new Date(deadline).toLocaleString()}
        overrideIsList={false}
        escrowTitle={escrowTitle}
        extraDescriptionUri={extraDescriptionUri}
        isPreview={true}
      />
      <NavigationButtons prevRoute="/new-transaction/notifications" nextRoute="/new-transaction/deliverable" />
    </Container>
  );
};

export default Preview;
