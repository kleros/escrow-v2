import React from "react";
import styled from "styled-components";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { formatEther } from "viem";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { isUndefined } from "utils/index";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

interface IOverview extends TransactionDetailsFragment {}

const Overview: React.FC<IOverview> = ({ transactionUri, amount, deadline, asset, seller, buyer }) => {
  const nativeTokenSymbol = useNativeTokenSymbol();
  const transactionInfo = useFetchIpfsJson(transactionUri);
  const currentUnixTime = Math.floor(Date.now() / 1000);
  const isPastDeadline = currentUnixTime > deadline;

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
      />
      {isPastDeadline && <WasItFulfilled />}
    </Container>
  );
};

export default Overview;
