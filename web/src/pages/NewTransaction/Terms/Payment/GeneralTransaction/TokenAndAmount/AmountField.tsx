import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Field } from "@kleros/ui-components-library";
import { useAccount, useBalance } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";

const StyledField = styled(Field)`
  width: 132px;
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input {
    font-size: 16px;
  }
`;

interface IAmount {
  quantity: string;
  setQuantity: (value: string) => void;
}

const Amount: React.FC<IAmount> = ({ quantity, setQuantity }) => {
  const { setHasSufficientNativeBalance } = useNewTransactionContext();
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address: address });
  const [error, setError] = useState("");

  useEffect(() => {
    const balanceAmount = balanceData ? parseFloat(balanceData.formatted) : 0;
    const enteredAmount = parseFloat(quantity);

    if (quantity && balanceAmount < enteredAmount) {
      setError("Insufficient balance");
      setHasSufficientNativeBalance(false);
    } else if (enteredAmount === 0) {
      setError("Amount is zero");
      setHasSufficientNativeBalance(false);
    } else {
      setError("");
      setHasSufficientNativeBalance(true);
    }
  }, [balanceData, quantity, setHasSufficientNativeBalance]);

  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  return (
    <StyledField
      value={quantity}
      onChange={handleWrite}
      type="number"
      placeholder="eg. 3.6"
      variant={error ? "error" : undefined}
      message={error}
    />
  );
};

export default Amount;
