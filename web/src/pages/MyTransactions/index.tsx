import React from "react";
import styled, { css } from "styled-components";

import { MAX_WIDTH_LANDSCAPE, landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";

import { Route, Routes } from "react-router-dom";
import { useAccount } from "wagmi";

import { DEFAULT_CHAIN } from "consts/chains";
import { TransactionDetailsProvider } from "context/TransactionDetailsContext";

import ConnectWallet from "components/ConnectWallet";
import TransactionsFetcher from "./TransactionsFetcher";
import TransactionDetails from "./TransactionDetails";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: 32px 16px 40px;
  max-width: ${MAX_WIDTH_LANDSCAPE};
  margin: 0 auto;

  ${landscapeStyle(
    () => css`
      padding: 48px ${responsiveSize(0, 132)} 60px;
    `
  )}
`;

export const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.primaryText};
`;

const Dashboard: React.FC = () => {
  const { isConnected, chain } = useAccount();
  const isOnSupportedChain = chain?.id === DEFAULT_CHAIN;

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
