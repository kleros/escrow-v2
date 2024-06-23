import React from "react";
import styled from "styled-components";
import { useAccount, useEnsAddress } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import PreviewCard from "components/PreviewCard";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { ensDomainPattern } from "utils/validateAddress";

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
  const { data: ensResolvedAddress } = useEnsAddress({
    enabled: ensDomainPattern.test(sellerAddress),
    name: sellerAddress,
    chainId: 1,
  });
  const resolvedSellerAddress = ensResolvedAddress || sellerAddress;

  return (
    <Container>
      <Header />
      <PreviewCard
        buyerAddress={address}
        sellerAddress={resolvedSellerAddress}
        assetSymbol={isNativeTransaction ? nativeTokenSymbol : sendingToken.symbol}
        overrideIsList={false}
        isPreview={true}
        deadline={new Date(deadline).getTime()}
        {...{
          receivingQuantity,
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
