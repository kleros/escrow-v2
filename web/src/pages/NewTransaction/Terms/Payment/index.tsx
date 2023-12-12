import React from "react";
import { useNewTransactionContext } from "context/NewTransactionContext";
import TokenTransaction from "../TokenTransaction";

const Payment: React.FC = () => {
  const {
    sendingQuantity,
    setSendingQuantity,
    sendingToken,
    setSendingToken,
    sendingRecipientAddress,
    setSendingRecipientAddress,
  } = useNewTransactionContext();

  return (
    <TokenTransaction
      headerText="I am paying"
      prevRoute="/newTransaction/deliverable"
      nextRoute="/newTransaction/deadline"
      quantity={sendingQuantity}
      setQuantity={setSendingQuantity}
      token={sendingToken}
      setToken={setSendingToken}
      recipientAddress={sendingRecipientAddress}
      setRecipientAddress={setSendingRecipientAddress}
    />
  );
};
export default Payment;
