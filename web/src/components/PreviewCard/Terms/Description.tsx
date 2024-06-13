import React from "react";
import styled from "styled-components";
import { StyledSkeleton } from "components/StyledSkeleton";
import { Copiable } from "@kleros/ui-components-library";
import { useEnsName } from "wagmi";
import { isUndefined } from "utils/index";
import { shortenAddress } from "utils/shortenAddress";

const StyledP = styled.p`
  margin: 0;
  word-break: break-word;
`;

const InlineBlockSpan = styled.span`
  display: inline-block;
`;

const StyledCopiable = styled(Copiable)`
  margin-right: 2px;
  gap: 6px;
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.primaryBlue};
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
  deadline: number;
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
  deadline,
  assetSymbol,
}) => {
  const buyerEns = useEnsName({ address: buyerAddress, chainId: 1 });
  const sellerEns = useEnsName({ address: sellerAddress, chainId: 1 });

  const displayBuyerAddress = buyerEns.data || shortenAddress(buyerAddress);
  const displaySellerAddress = sellerEns.data || shortenAddress(sellerAddress);

  const generalEscrowSummary = (
    <>
      By Paying {sendingQuantity}{" "}
      <InlineBlockSpan>{assetSymbol ? assetSymbol : <StyledSkeleton width={30} />}</InlineBlockSpan>, address{" "}
      <StyledCopiable copiableContent={buyerAddress ?? ""} info="Copy Buyer Address">
        <StyledSpan>{displayBuyerAddress}</StyledSpan>
      </StyledCopiable>{" "}
      should receive "{deliverableText}" from address{" "}
      <StyledCopiable copiableContent={sellerAddress ?? ""} info="Copy Seller Address">
        <StyledSpan>{displaySellerAddress}</StyledSpan>
      </StyledCopiable>{" "}
      before the delivery deadline {new Date(deadline).toString()}.
    </>
  );

  const cryptoSwapSummary = (
    <>
      By Paying {sendingQuantity} {sendingToken}, [Blockchain] address{" "}
      <StyledCopiable copiableContent={buyerAddress ?? ""} info="Copy Buyer Address">
        <StyledSpan>{displayBuyerAddress}</StyledSpan>
      </StyledCopiable>{" "}
      should receive {receivingQuantity} {receivingToken} at the [Blockchain] address{" "}
      <StyledCopiable copiableContent={sellerAddress ?? ""} info="Copy Seller Address">
        <StyledSpan>{displaySellerAddress}</StyledSpan>
      </StyledCopiable>{" "}
      from [Blockchain] address TODO before the delivery deadline {new Date(deadline).toString()}.
    </>
  );

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
