import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { responsiveSize } from "styles/responsiveSize";
import { useTransactionDetailsQuery } from "hooks/queries/useTransactionsQuery";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { formatEther } from "viem";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { isUndefined } from "utils/index";
import InfoCards from "./InfoCards";

const Container = styled.div``;

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.h1`
  margin-bottom: ${responsiveSize(16, 48)};
`;

const TransactionDetails: React.FC = () => {
  const { id } = useParams();
  const { data: transactionDetails } = useTransactionDetailsQuery(id);
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
    payments,
    hasToPayFees,
    settlementProposals,
    disputeRequest,
    resolvedEvents,
    setTransactionDetails,
  } = useTransactionDetailsContext();
  const transactionInfo = useFetchIpfsJson(transactionUri);
  const currentTimeUnixSeconds = Math.floor(Date.now() / 1000);

  useEffect(() => {
    if (transactionDetails) {
      setTransactionDetails(transactionDetails.escrow);
    } else setTransactionDetails({});
  }, [transactionDetails, setTransactionDetails]);

  return (
    <Container>
      <Header>Transaction #{id}</Header>
      <OverviewContainer>
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
          asset={asset}
          sendingQuantity={!isUndefined(amount) ? formatEther(amount) : ""}
          sendingToken={asset === "native" ? nativeTokenSymbol : asset}
          deadlineDate={new Date(deadline * 1000).toLocaleString()}
          tokenSymbol={asset === "native" ? nativeTokenSymbol : asset}
          overrideIsList={false}
          amount={!isUndefined(amount) ? formatEther(amount) : ""}
          isPreview={false}
          payments={payments}
          settlementProposals={settlementProposals}
          hasToPayFees={hasToPayFees}
          disputeRequest={disputeRequest}
          resolvedEvents={resolvedEvents}
        />
        {status === "NoDispute" && currentTimeUnixSeconds < deadline && payments?.length === 0 ? (
          <WasItFulfilled />
        ) : null}
        <InfoCards />
      </OverviewContainer>
    </Container>
  );
};

export default TransactionDetails;
