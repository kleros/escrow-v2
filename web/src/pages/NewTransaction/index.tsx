import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useWindowSize } from "react-use";
import { BREAKPOINT_LANDSCAPE } from "styles/landscapeStyle";
import Title from "./EscrowDetails/Title";
import TypeOfEscrow from "./EscrowDetails/TypeOfEscrow";
import HeroImage from "./HeroImage";
import Preview from "./Preview";
import Deadline from "./Terms/Deadline";
import Deliverable from "./Terms/Deliverable";
import Notifications from "./Terms/Notifications";
import Payment from "./Terms/Payment";
import Timeline from "./Timeline";
import { responsiveSize } from "styles/responsiveSize";
import { useAccount, useNetwork } from "wagmi";
import ConnectWallet from "components/ConnectWallet";
import { ConnectWalletContainer } from "../MyTransactions";
import { DEFAULT_CHAIN } from "consts/chains";
import { EnsureAuth } from "components/EnsureAuth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: ${responsiveSize(24, 32)};
  padding-top: ${responsiveSize(36, 42)};
  padding-bottom: ${responsiveSize(76, 96)};
  max-width: 1780px;
  margin: 0 auto;
`;

const MiddleContentContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const NewTransaction: React.FC = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const isPreviewPage = location.pathname.includes("/preview");
  const isMobileView = width <= BREAKPOINT_LANDSCAPE;
  const isOnSupportedChain = chain?.id === DEFAULT_CHAIN;

  return (
    <>
      {!isPreviewPage || isMobileView ? <HeroImage /> : null}
      <Container>
        {isConnected && isOnSupportedChain && !isPreviewPage ? <Timeline /> : null}
        {isConnected && isOnSupportedChain ? (
          <EnsureAuth message={"Sign a message to verify yourself."} buttonText="Verify">
            <MiddleContentContainer>
              <Routes>
                <Route index element={<Navigate to="escrow-type" replace />} />
                <Route path="/escrow-type/*" element={<TypeOfEscrow />} />
                <Route path="/title/*" element={<Title />} />
                <Route path="/deliverable/*" element={<Deliverable />} />
                <Route path="/payment/*" element={<Payment />} />
                <Route path="/deadline/*" element={<Deadline />} />
                <Route path="/notifications/*" element={<Notifications />} />
                <Route path="/preview/*" element={<Preview />} />
              </Routes>
            </MiddleContentContainer>
          </EnsureAuth>
        ) : (
          <ConnectWalletContainer>
            To create a new escrow transaction, connect first and switch to the supported chain
            <hr />
            <ConnectWallet />
          </ConnectWalletContainer>
        )}
      </Container>
    </>
  );
};

export default NewTransaction;
