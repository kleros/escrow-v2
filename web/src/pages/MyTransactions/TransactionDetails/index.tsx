import React, { useEffect } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useParams } from "react-router-dom";
import { formatEther } from "viem";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { isUndefined } from "utils/index";
import { formatTimeoutDuration } from "utils/formatTimeoutDuration";
import { pickBufferFor } from "utils/bufferRules";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";
import InfoCards from "./InfoCards";
import { useEscrowParametersQuery } from "queries/useEscrowParametersQuery";
import { useTransactionDetailsQuery } from "queries/useTransactionsQuery";
import { useReadKlerosCoreArbitrationCost } from "hooks/contracts/generated";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { useTokenMetadata } from "hooks/useTokenMetadata";
import BufferPeriodWarning from "./InfoCards/BufferPeriodWarning";

const Container = styled.div``;

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.h1`
  margin-bottom: ${responsiveSize(12, 24)};
  font-size: ${responsiveSize(20, 24)};
`;

const TransactionDetails: React.FC = () => {
  const { id } = useParams();
  const { data: transactionDetails } = useTransactionDetailsQuery(id);
  const { data: escrowParameters } = useEscrowParametersQuery();
  const arbitrationCost = useReadKlerosCoreArbitrationCost({
    args: [escrowParameters?.escrowParameters?.arbitratorExtraData],
  });
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

  const disputeDeadlineMs = deadline * 1000;
  const bufferSecNumber = transactionInfo?.bufferSec ?? pickBufferFor(timestamp);
  const deliveryDeadlineMs = disputeDeadlineMs - bufferSecNumber * 1000;
  const now = Date.now();
  const inBuffer = now > deliveryDeadlineMs && now < disputeDeadlineMs;
  const secondsLeft = Math.max(0, Math.floor((disputeDeadlineMs - now) / 1000));

  return (
    <Container>
      <Header>Transaction #{id}</Header>
      <OverviewContainer>
        {inBuffer && (
          <BufferPeriodWarning
            message={`Delivery deadline is over. You have ${formatTimeoutDuration(secondsLeft)} to either reach a settlement with the other party or raise a dispute.`}
          />
        )}
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
          deadline={deliveryDeadlineMs}
          overrideIsList={false}
          amount={!isUndefined(amount) ? formatEther(amount) : ""}
          isPreview={false}
          feeTimeout={escrowParameters?.escrowParameters.feeTimeout}
          settlementTimeout={escrowParameters?.escrowParameters.settlementTimeout}
          arbitrationCost={arbitrationCost?.data}
          {...{
            status,
            token,
            payments,
            settlementProposals,
            hasToPayFees,
            disputeRequest,
            resolvedEvents,
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
