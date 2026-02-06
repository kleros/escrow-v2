import React, { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { IToken } from "context/NewTransactionContext";
import { isUndefined } from "utils/index";
import { getFormattedBalance } from "utils/getFormattedBalance";
import { erc20Abi } from "viem";

interface IBalance {
  token: IToken;
}

const Balance: React.FC<IBalance> = ({ token }) => {
  const { address } = useAccount();
  const isNativeTransaction = token?.address === "native";

  const { data: nativeBalance } = useBalance({
    query: { enabled: isNativeTransaction },
    address: address as `0x${string}`,
  });

  const { data: tokenBalance } = useReadContract({
    query: { enabled: !isNativeTransaction },
    address: token?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  const formattedBalance = useMemo(() => {
    const balance = isNativeTransaction ? nativeBalance?.value : tokenBalance;
    return !isUndefined(balance) ? getFormattedBalance(balance, token) : undefined;
  }, [isNativeTransaction, nativeBalance, tokenBalance, token]);

  return (
    <p className="text-klerosUIComponentsPrimaryText m-0">
      {isUndefined(formattedBalance) ? <Skeleton width={52} height={20} /> : null}
      {!isUndefined(formattedBalance) && formattedBalance !== "0" ? formattedBalance : null}
    </p>
  );
};

export default Balance;
