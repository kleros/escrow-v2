import React, { useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import { useBalance, useAccount } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { getFormattedBalance } from "utils/getFormattedBalance";
import AmountField from "./AmountField";
import TokenSelector from "./TokenSelector";
import MaxBalance from "./MaxBalance";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24px;
  margin-bottom: ${responsiveSize(16, 0)};
  flex-wrap: wrap;
`;

const TokenSelectorAndMaxBalance = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

  const formattedBalance = useMemo(() => getFormattedBalance(balanceData, sendingToken), [balanceData, sendingToken]);

  return (
    <Container>
      <AmountField quantity={quantity} setQuantity={setQuantity} error={error} />
      <TokenSelectorAndMaxBalance>
        <TokenSelector />
        <MaxBalance
          formattedBalance={formattedBalance}
          rawBalance={parseFloat(balanceData?.formatted)}
          setQuantity={setQuantity}
        />
      </TokenSelectorAndMaxBalance>
    </Container>
  );
};
export default TokenAndAmount;
