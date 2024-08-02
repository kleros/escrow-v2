import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
import { DEFAULT_CHAIN } from "consts/chains";
import ConnectWallet from "components/ConnectWallet";
import TransactionsFetcher from "./TransactionsFetcher";
import TransactionDetails from "./TransactionDetails";
import { TransactionDetailsProvider } from "context/TransactionDetailsContext";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: calc(24px + (136 - 24) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-top: calc(32px + (80 - 32) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-bottom: calc(76px + (96 - 76) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  max-width: 1780px;
  margin: 0 auto;
`;

export const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.primaryText};
`;

const Dashboard: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isOnSupportedChain = chainId === DEFAULT_CHAIN;

  return (
    <Container>
      {isConnected && isOnSupportedChain ? (
        <Routes>
          <Route path="/display/:page/:order/:filter" element={<TransactionsFetcher />} />

          <Route
            path="/:id/*"
            element={
              <TransactionDetailsProvider>
                <TransactionDetails />
              </TransactionDetailsProvider>
            }
          />
        </Routes>
      ) : (
        <ConnectWalletContainer>
          To see your transactions, connect first and switch to the supported chain
          <hr />
          <ConnectWallet />
        </ConnectWalletContainer>
      )}
    </Container>
  );
};

export default Dashboard;
