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
import { useEscrowParametersQuery } from "queries/useEscrowParametersQuery";
import { useTransactionDetailsQuery } from "queries/useTransactionsQuery";
import { useArbitrationCost } from "queries/useArbitrationCostFromKlerosCore";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { useTokenMetadata } from "hooks/useTokenMetadata";
import { StyledH1 } from "components/StyledTags";

const Container = styled.div``;

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled(StyledH1)`
  margin-bottom: ${responsiveSize(12, 24)};
  font-size: ${responsiveSize(20, 24)};
`;

const TransactionDetails: React.FC = () => {
  const { id } = useParams();
  const { data: transactionDetails } = useTransactionDetailsQuery(id);
  const { data: escrowParameters } = useEscrowParametersQuery();
  const { arbitrationCost } = useArbitrationCost(escrowParameters?.escrowParameters?.arbitratorExtraData);
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { tokenMetadata } = useTokenMetadata(transactionDetails?.escrow?.token);
  const erc20TokenSymbol = tokenMetadata?.symbol;
  const { setTransactionDetails } = useTransactionDetailsContext();

  const {
    timestamp,
    transactionUri,
    amount,
    deadline,
    token,
    seller,
    buyer,
    status,
    transactionHash,
    payments,
    hasToPayFees,
    settlementProposals,
    disputeRequest,
    resolvedEvents,
  } = useTransactionDetailsContext();

  const transactionInfo = useFetchIpfsJson(transactionUri);
  const assetSymbol = token ? erc20TokenSymbol : nativeTokenSymbol;

  useEffect(() => {
    if (transactionDetails?.escrow) {
      const detailsWithSymbol = {
        ...transactionDetails.escrow,
        assetSymbol,
      };
      setTransactionDetails(detailsWithSymbol);
    }
  }, [transactionDetails, setTransactionDetails, assetSymbol]);

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
          sellerAddress={seller}
          transactionCreationTimestamp={timestamp}
          sendingQuantity={!isUndefined(amount) ? formatEther(amount) : ""}
          deadline={deadline * 1000}
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
            assetSymbol,
            transactionHash,
          }}
        />
        {status === "NoDispute" && payments?.length === 0 ? <WasItFulfilled /> : null}
        <InfoCards />
      </OverviewContainer>
    </Container>
  );
};

export default TransactionDetails;
