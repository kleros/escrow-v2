import React from "react";
import styled from "styled-components";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";
import WaitingPartyInfo from "./WaitingPartyInfo";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { formatEther } from "viem";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { isUndefined } from "utils/index";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import DisputeInfo from "./DisputeInfo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Overview: React.FC = () => {
  const nativeTokenSymbol = useNativeTokenSymbol();
  const {
    timestamp,
    transactionUri,
    amount,
    deadline,
    asset,
    seller,
    buyer,
    status,
    disputeRequest,
    hasToPayFees,
    resolvedEvents,
  } = useTransactionDetailsContext();
  const transactionInfo = useFetchIpfsJson(transactionUri);

  return (
    <Container>
      <PreviewCard
        escrowType={"general"}
        escrowTitle={transactionInfo?.title}
        deliverableText={transactionInfo?.description}
        extraDescriptionUri={transactionInfo?.extraDescriptionUri}
        receivingQuantity={""}
        buyerAddress={buyer}
        receivingToken={asset === "native" ? nativeTokenSymbol : asset}
        sellerAddress={seller}
        transactionCreationTimestamp={timestamp}
        status={status}
        sendingQuantity={!isUndefined(amount) ? formatEther(amount) : ""}
        sendingToken={asset === "native" ? nativeTokenSymbol : asset}
        deadlineDate={new Date(deadline * 1000).toLocaleString()}
        tokenSymbol={asset === "native" ? nativeTokenSymbol : asset}
        overrideIsList={false}
        amount={!isUndefined(amount) ? formatEther(amount) : ""}
        isPreview={false}
        disputeRequest={disputeRequest}
        hasToPayFees={hasToPayFees}
        resolvedEvents={resolvedEvents}
      />
      {status !== "TransactionResolved" && hasToPayFees?.length === 0 ? <WasItFulfilled /> : null}
      {status === "WaitingSeller" ? <WaitingPartyInfo pendingParty="seller" /> : null}
      {status === "WaitingBuyer" ? <WaitingPartyInfo pendingParty="buyer" /> : null}
      {status === "DisputeCreated" ? <DisputeInfo /> : null}
    </Container>
  );
};

export default Overview;
