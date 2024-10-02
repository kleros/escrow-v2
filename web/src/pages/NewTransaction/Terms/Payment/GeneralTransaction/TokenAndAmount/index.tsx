import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useAccount, useReadContract, useBalance } from "wagmi";
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
  
  const isNativeTransaction = sendingToken?.address === 'native';

  const { data: nativeBalance } = useBalance({
    address: isNativeTransaction ? address as `0x${string}` : undefined,
  });

  const { data: tokenBalance } = useReadContract({
    address: !isNativeTransaction ? sendingToken?.address as `0x${string}` : undefined,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  const { data: tokenDecimal } = useReadContract({
    address: !isNativeTransaction ? sendingToken?.address as `0x${string}` : undefined,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const [error, setError] = useState("");

  const balanceAmount = useMemo(() => {
    if (isNativeTransaction) {
      return nativeBalance ? parseFloat(formatUnits(nativeBalance.value, nativeBalance.decimals)) : 0;
    } else {
      return tokenBalance && tokenDecimal ? parseFloat(formatUnits(tokenBalance, tokenDecimal)) : 0;
    }
  }, [isNativeTransaction, nativeBalance, tokenBalance, tokenDecimal]);

  useEffect(() => {
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
  }, [quantity, setHasSufficientNativeBalance, sendingToken]);

  const formattedBalance = useMemo(() => {
    const balance = isNativeTransaction ? nativeBalance : tokenBalance;
    return getFormattedBalance(balance, sendingToken);
  }, [balanceAmount, sendingToken, isNativeTransaction, nativeBalance, tokenBalance]);

  return (
    <Container>
      <AmountField quantity={quantity} setQuantity={setQuantity} error={error} />
      <TokenSelectorAndMaxBalance>
        <TokenSelector />
        <MaxBalance
          formattedBalance={formattedBalance}
          rawBalance={balanceAmount}
          setQuantity={setQuantity}
        />
      </TokenSelectorAndMaxBalance>
    </Container>
  );
};

export default TokenAndAmount;
