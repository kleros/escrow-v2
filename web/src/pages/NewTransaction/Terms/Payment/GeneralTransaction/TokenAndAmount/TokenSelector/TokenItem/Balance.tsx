import React, { useMemo } from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { useAccount, useBalance } from "wagmi";
import { IToken } from "context/NewTransactionContext";
import { isUndefined } from "utils/index";
import { getFormattedBalance } from "utils/getFormattedBalance";

const Container = styled.p`
  color: ${({ theme }) => theme.primaryText};
  margin: 0;
`;

const StyledAmountSkeleton = styled(Skeleton)`
  width: 52px;
  height: 20px;
`;

interface IBalance {
  token: IToken;
}

const Balance: React.FC<IBalance> = ({ token }) => {
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address: address,
    token: token?.address === "native" ? undefined : token?.address,
  });

  const formattedBalance = useMemo(() => getFormattedBalance(balanceData, token), [balanceData, token]);

  return (
    <Container>
      {isUndefined(formattedBalance) ? <StyledAmountSkeleton /> : null}
      {!isUndefined(formattedBalance) && formattedBalance !== "0" ? formattedBalance : null}
    </Container>
  );
};

export default Balance;
