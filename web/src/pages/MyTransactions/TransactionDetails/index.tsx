import React, { useEffect } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useParams } from "react-router-dom";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { isUndefined } from "utils/index";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";
import InfoCards from "./InfoCards";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { useEscrowParametersQuery } from "hooks/queries/useEscrowParametersQuery";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { useTransactionDetailsQuery } from "hooks/queries/useTransactionsQuery";
import { useArbitrationCost } from "hooks/queries/useArbitrationCostFromKlerosCore";

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
  const { data: escrowParameters } = useEscrowParametersQuery();
  const { arbitrationCost } = useArbitrationCost(escrowParameters?.escrowParameters?.arbitratorExtraData);
  const nativeTokenSymbol = useNativeTokenSymbol();
  const {
    timestamp,
    transactionUri,
    amount,
    deadline,
    token,
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

  useEffect(() => {
    setTransactionDetails(transactionDetails?.escrow);
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
          receivingToken={!token ? nativeTokenSymbol : token}
          sellerAddress={seller}
          transactionCreationTimestamp={timestamp}
          sendingQuantity={!isUndefined(amount) ? formatEther(amount) : ""}
          sendingToken={!token ? nativeTokenSymbol : token}
          deadlineDate={new Date(deadline * 1000).toLocaleString()}
          assetSymbol={!token ? nativeTokenSymbol : token}
          overrideIsList={false}
          amount={!isUndefined(amount) ? formatEther(amount) : ""}
          isPreview={false}
          feeTimeout={escrowParameters?.escrowParameters.feeTimeout}
          settlementTimeout={escrowParameters?.escrowParameters.settlementTimeout}
          {...{
            status,
            token,
            payments,
            settlementProposals,
            hasToPayFees,
            disputeRequest,
            resolvedEvents,
            arbitrationCost,
          }}
        />
        {status === "NoDispute" && payments?.length === 0 ? <WasItFulfilled /> : null}
        <InfoCards />
      </OverviewContainer>
    </Container>
  );
};

export default TransactionDetails;
