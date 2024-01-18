import React from "react";
import styled from "styled-components";
import ViewCaseButton from "./ViewCaseButton";
import RaiseDisputeButton from "../../Overview/WasItFulfilled/Buttons/RaiseDisputeButton";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { useAccount } from "wagmi";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

interface IButtons {
  disputeID: string;
  transactionData: TransactionDetailsFragment;
}

const Buttons: React.FC<IButtons> = ({ disputeID, transactionData }) => {
  const { address } = useAccount();
  const connectedAddress = address?.toLowerCase();
  const buyerAddress = transactionData?.buyer?.toLowerCase();
  const sellerAddress = transactionData?.seller?.toLowerCase();

  const shouldPayFee = transactionData?.hasToPayFees?.some((fee) => {
    const partyRequiredToPay = fee.party;
    if (partyRequiredToPay === "1" && connectedAddress === buyerAddress) {
      return true;
    }
    if (partyRequiredToPay === "2" && connectedAddress === sellerAddress) {
      return true;
    }
    return false;
  });

  const shouldDisplayRaiseDisputeButton = shouldPayFee && !transactionData?.disputeRequest;

  return (
    <Container>
      {shouldDisplayRaiseDisputeButton && <RaiseDisputeButton transactionData={transactionData} />}
      {transactionData?.disputeRequest && <ViewCaseButton disputeID={disputeID} />}
    </Container>
  );
};
export default Buttons;
