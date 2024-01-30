import React from "react";
import styled from "styled-components";
import ViewCaseButton from "./ViewCaseButton";
import RaiseDisputeButton from "components/RaiseDisputeButton";
import { useAccount } from "wagmi";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";
import { formatEther } from "viem";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

const Buttons: React.FC = () => {
  const { address } = useAccount();
  const connectedAddress = address?.toLowerCase();
  const { buyer, seller, disputeRequest, hasToPayFees } = useTransactionDetailsContext();

  const shouldPayFee = hasToPayFees?.some((fee) => {
    const partyRequiredToPay = fee.party;
    if (partyRequiredToPay === "1" && connectedAddress === buyer.toLowerCase()) {
      return true;
    }
    if (partyRequiredToPay === "2" && connectedAddress === seller.toLowerCase()) {
      return true;
    }
    return false;
  });

  const shouldDisplayRaiseDisputeButton = shouldPayFee && !disputeRequest;

  return (
    <>
      {shouldDisplayRaiseDisputeButton ? (
        <Container>
          <RaiseDisputeButton buttonText={`Deposit the fee: ${formatEther(BigInt("30000000000000"))} ETH`} />
        </Container>
      ) : null}
      {disputeRequest ? (
        <Container>
          <ViewCaseButton />
        </Container>
      ) : null}
    </>
  );
};
export default Buttons;
