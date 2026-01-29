import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatETH, formatTokenAmount } from "utils/format";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { isUndefined } from "utils/index";
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
  const tokenDecimals = tokenMetadata?.decimals ?? 18;
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
  const isNativeTransaction = !token;
  const formattedAmount = !isUndefined(amount)
    ? isNativeTransaction
      ? formatETH(amount)
      : formatTokenAmount(amount, tokenDecimals)
    : "";

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

  return (
    <div>
      <h1 className="mb-fluid-12-24 text-(length:--spacing-fluid-20-24)">Transaction #{id}</h1>
      <div className="flex flex-col gap-8">
        <BufferPeriodWarning disputeDeadlineMs={disputeDeadlineMs} deliveryDeadlineMs={deliveryDeadlineMs} />
        <PreviewCard
          escrowType={"general"}
          escrowTitle={transactionInfo?.title}
          deliverableText={transactionInfo?.description}
          extraDescriptionUri={transactionInfo?.extraDescriptionUri}
          receivingQuantity={""}
          buyerAddress={buyer}
          sellerAddress={seller}
          transactionCreationTimestamp={timestamp}
          sendingQuantity={formattedAmount}
          deadline={deliveryDeadlineMs}
          overrideIsList={false}
          amount={formattedAmount}
          isNativeTransaction={isNativeTransaction}
          tokenDecimals={tokenDecimals}
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
      </div>
    </div>
  );
};

export default TransactionDetails;
