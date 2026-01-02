import React from "react";
import AttachedFile from "./AttachedFile";
import Description from "./Description";

interface ITerms {
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
  extraDescriptionUri: string;
  buyer: string;
}

const Terms: React.FC<ITerms> = ({
  escrowType,
  deliverableText,
  receivingQuantity,
  buyerAddress,
  sendingQuantity,
  sellerAddress,
  deadline,
  assetSymbol,
  extraDescriptionUri,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h3 className="m-0 text-klerosUIComponentsPrimaryText font-semibold">Terms</h3>
      <Description
        {...{
          escrowType,
          deliverableText,
          receivingQuantity,
          buyerAddress,
          sendingQuantity,
          sellerAddress,
          deadline,
          assetSymbol,
        }}
      />
      <AttachedFile {...{ extraDescriptionUri }} />
    </div>
  );
};
export default Terms;
