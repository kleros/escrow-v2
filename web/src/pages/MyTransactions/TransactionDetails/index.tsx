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
import { useERC20TokenSymbol } from "hooks/useERC20TokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";

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
  const { erc20TokenSymbol } = useERC20TokenSymbol(transactionDetails?.escrow?.token);
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
    payments,
    hasToPayFees,
    settlementProposals,
    disputeRequest,
    resolvedEvents,
  } = useTransactionDetailsContext();

  const transactionInfo = useFetchIpfsJson(transactionUri);

  useEffect(() => {
    if (transactionDetails?.escrow) {
      const detailsWithSymbol = {
        ...transactionDetails.escrow,
        erc20TokenSymbol: token ? erc20TokenSymbol : nativeTokenSymbol,
      };
      setTransactionDetails(detailsWithSymbol);
    }
  }, [transactionDetails, setTransactionDetails, erc20TokenSymbol, nativeTokenSymbol, token]);

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
          assetSymbol={!token ? nativeTokenSymbol : erc20TokenSymbol}
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
