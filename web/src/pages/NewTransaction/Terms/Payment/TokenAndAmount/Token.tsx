import React from "react";
import { DropdownSelect } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";

const Token: React.FC = () => {
  const { paymentToken, setPaymentToken } = useNewTransactionContext();

  const handleTokenChange = (value: string | number) => {
    setPaymentToken(value.toString());
  };

  return (
    <DropdownSelect
      items={[
        { text: "xDAI", dot: "red", value: "xDAI" },
        { text: "ETH", dot: "blue", value: "ETH" },
      ]}
      callback={handleTokenChange}
    />
  );
};

export default Token;
