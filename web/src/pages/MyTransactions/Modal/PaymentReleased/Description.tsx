import React from "react";
import { shortenAddress } from "utils/shortenAddress";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Description: React.FC = () => {
  const { seller } = useTransactionDetailsContext();

  return (
    <div className="flex flex-col items-center text-center mb-8">
      <p className="m-0">Escrow concluded. The funds were released to {shortenAddress(seller)}.</p>
      <p className="m-0 font-semibold">Thanks for using Kleros Escrow.</p>
    </div>
  );
};
export default Description;
