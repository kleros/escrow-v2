import React from "react";
import styled from "styled-components";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { useAccount } from "wagmi";

const StyledP = styled.p`
  margin: 0;
  word-break: break-word;
`;

const Description: React.FC = () => {
  const {
    escrowType,
    deliverableText,
    receivingQuantity,
    receivingToken,
    receivingRecipientAddress,
    sendingQuantity,
    sendingToken,
    sendingRecipientAddress,
    deadline,
  } = useNewTransactionContext();

  const { address } = useAccount();

  const generalEscrowSummary =
    `By Paying ${
      sendingQuantity + " " + sendingToken
    }, [Blockchain] address ${address} should receive ${deliverableText} ` +
    `from [Blockchain] address ${sendingRecipientAddress} before the delivery deadline ${deadline}.`;

  const cryptoSwapSummary =
    `By Paying ${sendingQuantity + " " + sendingToken}, [Blockchain] address ${address} should receive ${
      receivingQuantity + " " + receivingToken
    } at the [Blockchain] ` +
    `address ${receivingRecipientAddress} from [Blockchain] address ${sendingRecipientAddress} before the delivery deadline ${deadline}.`;

  return (
    <div>
      <StyledP>{escrowType === "general" ? generalEscrowSummary : cryptoSwapSummary}</StyledP>
      <br></br>
      <StyledP>
        After the delivery deadline, you can start a complaint (propose a settlement or raise a dispute). In case of a
        dispute, it will be arbitrated by the Kleros Freelancing Court.
      </StyledP>
    </div>
  );
};
export default Description;
