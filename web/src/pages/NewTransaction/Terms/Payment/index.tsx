import React from "react";
import { useNewTransactionContext } from "context/NewTransactionContext";
import TokenTransaction from "./TokenTransaction";
import GeneralTransaction from "./GeneralTransaction";

const Payment: React.FC = () => {
  const {
    escrowType,
    sendingQuantity,
    setSendingQuantity,
    sendingToken,
    setSendingToken,
    sellerAddress,
    setSellerAddress,
  } = useNewTransactionContext();

  return escrowType === "general" ? (
    <GeneralTransaction />
  ) : (
    <TokenTransaction
      headerText="I am paying"
      prevRoute="/newTransaction/deliverable"
      nextRoute="/newTransaction/deadline"
      quantity={sendingQuantity}
      setQuantity={setSendingQuantity}
      token={sendingToken}
      setToken={setSendingToken}
      recipientAddress={sellerAddress}
      setRecipientAddress={setSellerAddress}
    />
  );
};

export default Payment;
