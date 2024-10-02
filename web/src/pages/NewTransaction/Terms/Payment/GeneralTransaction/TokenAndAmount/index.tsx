import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useAccount, useReadContract } from "wagmi";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { getFormattedBalance } from "utils/getFormattedBalance";
import { erc20Abi } from "viem";
import { formatUnits } from "viem";
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
  
  const { data: balanceData } = useReadContract({
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  const { data: tokenDecimal } = useReadContract({
    address: sendingToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const balanceAmount = balanceData && tokenDecimal ? parseFloat(formatUnits(balanceData, tokenDecimal)) : 0;
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
  }, [balanceData, quantity, setHasSufficientNativeBalance, sendingToken]);

  const formattedBalance = useMemo(() => getFormattedBalance(balanceData, sendingToken), [balanceData, sendingToken]);

  return (
    <Container>
      <AmountField quantity={quantity} setQuantity={setQuantity} error={error} />
      <TokenSelectorAndMaxBalance>
        <TokenSelector />
        <MaxBalance
          formattedBalance={formattedBalance}
          rawBalance={parseFloat(formatUnits(balanceData, tokenDecimal))}
          setQuantity={setQuantity}
        />
      </TokenSelectorAndMaxBalance>
    </Container>
  );
};

export default TokenAndAmount;
