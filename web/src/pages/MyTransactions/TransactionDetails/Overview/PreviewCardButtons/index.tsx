import React from "react";
import styled from "styled-components";
import ViewCaseButton from "./ViewCaseButton";
import RaiseDisputeButton from "./RaiseDisputeButton"
import { useAccount } from "wagmi";
import { formatEther } from "viem";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

interface IButtons {
  buyerAddress: string;
  sellerAddress: string;
  disputeRequest: [];
  hasToPayFees: [];
  resolvedEvents: [];
}

const Buttons: React.FC<IButtons> = ({ buyerAddress, sellerAddress, disputeRequest, hasToPayFees, resolvedEvents }) => {
  const { address } = useAccount();
  const connectedAddress = address?.toLowerCase();

  const shouldPayFee = hasToPayFees?.some((fee) => {
    const partyRequiredToPay = fee.party;
    if (partyRequiredToPay === "1" && connectedAddress === buyerAddress.toLowerCase()) {
      return true;
    }
    if (partyRequiredToPay === "2" && connectedAddress === sellerAddress.toLowerCase()) {
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
          <ViewCaseButton disputeRequest={disputeRequest} resolvedEvents={resolvedEvents} />
        </Container>
      ) : null}
    </>
  );
};
export default Buttons;
