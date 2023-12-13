import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { decodeURIFilter, useRootPath } from "utils/uri";
import ConnectWallet from "components/ConnectWallet";

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
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.primaryText};
`;

const Dashboard: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { page, order, filter } = useParams();
  const location = useRootPath();
  const navigate = useNavigate();
  const casesPerPage = 3;
  const pageNumber = parseInt(page ?? "1");

  return (
    <Container>
      {isConnected ? (
        <>Hi. These are your transactions</>
      ) : (
        <ConnectWalletContainer>
          To see your transactions, connect first
          <hr />
          <ConnectWallet />
        </ConnectWalletContainer>
      )}
    </Container>
  );
};

export default Dashboard;
