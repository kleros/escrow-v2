import React from "react";
import styled from "styled-components";
import { StyledSkeleton } from "components/StyledSkeleton";
import { isUndefined } from "utils/index";

const StyledP = styled.p`
  margin: 0;
  word-break: break-word;
`;

interface IDescription {
  escrowType: string;
  deliverableText: string;
  receivingQuantity: string;
  receivingToken: string;
  receivingRecipientAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sendingRecipientAddress: string;
  deadlineDate: Date;
  tokenSymbol: string;
  buyer: string;
}

const Description: React.FC<IDescription> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  receivingToken,
  receivingRecipientAddress,
  sendingQuantity,
  sendingToken,
  sendingRecipientAddress,
  deadlineDate,
  tokenSymbol,
  buyer,
}) => {
  const generalEscrowSummary =
    `By Paying ${sendingQuantity + " " + tokenSymbol}, address ${buyer} should receive` +
    ` ${deliverableText} from address ${sendingRecipientAddress} before the delivery deadline ${new Date(
      deadlineDate
    )}.`;

  const cryptoSwapSummary =
    `By Paying ${sendingQuantity + " " + sendingToken}, [Blockchain] address ${buyer} should receive` +
    ` ${receivingQuantity + " " + receivingToken} at the [Blockchain] address ${receivingRecipientAddress}` +
    ` from [Blockchain] address ${sendingRecipientAddress} before the delivery deadline ${deadlineDate}.`;

  return isUndefined(deliverableText) ? (
    <StyledSkeleton />
  ) : (
    <div>
      <StyledP>{escrowType === "general" ? generalEscrowSummary : cryptoSwapSummary}</StyledP>
      <br />
      <StyledP>
        After the delivery deadline, you can start a complaint (propose a settlement or raise a dispute). In case of a
        dispute, it will be arbitrated by the Kleros Freelancing Court.
      </StyledP>
    </div>
  );
};
export default Description;
