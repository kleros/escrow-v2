import React from "react";
import { Field } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";

const Amount: React.FC = () => {
  const { paymentQuantity, setPaymentQuantity } = useNewTransactionContext();

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentQuantity(event.target.value);
  };

  return <Field value={paymentQuantity} onChange={handleWrite} type="number" placeholder="eg. 3.6" />;
};
export default Amount;
