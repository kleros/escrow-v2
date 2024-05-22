import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useBalance, useAccount } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { responsiveSize } from "styles/responsiveSize";
import AmountField from "./AmountField";
import TokenSelector from "./TokenSelector";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
  margin-bottom: ${responsiveSize(24, 18)};
  margin-left: 36px;
`;

interface ITokenAndAmount {
  quantity: string;
  setQuantity: (value: string) => void;
}

const TokenAndAmount: React.FC<ITokenAndAmount> = ({ quantity, setQuantity }) => {
  const { address } = useAccount();
  const { sendingToken, setHasSufficientNativeBalance } = useNewTransactionContext();
  const { data: balanceData } = useBalance({
    address: address,
    token: sendingToken?.address === "native" ? undefined : sendingToken?.address,
  });
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

  return (
    <Container>
      <AmountField quantity={quantity} setQuantity={setQuantity} error={error} />
      <TokenSelector />
    </Container>
  );
};
export default TokenAndAmount;
