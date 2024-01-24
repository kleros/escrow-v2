import React from "react";
import styled from "styled-components";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { formatEther } from "viem";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { isUndefined } from "utils/index";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Overview: React.FC = () => {
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { transactionUri, amount, deadline, asset, seller, buyer, status, hasToPayFees } =
    useTransactionDetailsContext();
  const transactionInfo = useFetchIpfsJson(transactionUri);

  return (
    <Container>
      <PreviewCard
        escrowType={"general"}
        escrowTitle={transactionInfo?.title}
        deliverableText={transactionInfo?.description}
        extraDescriptionUri={transactionInfo?.extraDescriptionUri}
        receivingQuantity={""}
        buyer={buyer}
        receivingToken={asset === "native" ? nativeTokenSymbol : asset}
        receivingRecipientAddress={seller}
        sendingQuantity={!isUndefined(amount) ? formatEther(amount) : ""}
        sendingToken={asset === "native" ? nativeTokenSymbol : asset}
        sendingRecipientAddress={seller}
        deadlineDate={new Date(deadline * 1000).toLocaleString()}
        tokenSymbol={asset === "native" ? nativeTokenSymbol : asset}
        overrideIsList={false}
        amount={!isUndefined(amount) ? formatEther(amount) : ""}
        isPreview={false}
      />
      {status !== "TransactionResolved" && hasToPayFees?.length === 0 ? <WasItFulfilled /> : null}
    </Container>
  );
};

export default Overview;
