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
  buyerAddress: string;
  sendingQuantity: string;
  sendingToken: string;
  sellerAddress: string;
  deadlineDate: Date;
  assetSymbol: string;
  buyer: string;
}

const Description: React.FC<IDescription> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  receivingToken,
  buyerAddress,
  sendingQuantity,
  sendingToken,
  sellerAddress,
  deadlineDate,
  assetSymbol,
}) => {
  const generalEscrowSummary =
    `By Paying ${sendingQuantity + " " + assetSymbol}, address ${buyerAddress} should receive` +
    ` "${deliverableText}" from address ${sellerAddress} before the delivery deadline ${new Date(
      deadlineDate
    )}.`;

  const cryptoSwapSummary =
    `By Paying ${sendingQuantity + " " + sendingToken}, [Blockchain] address ${buyerAddress} should receive` +
    ` ${receivingQuantity + " " + receivingToken} at the [Blockchain] address ${sellerAddress}` +
    ` from [Blockchain] address TODO before the delivery deadline ${deadlineDate}.`;

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
