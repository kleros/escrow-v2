import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useWindowSize } from "react-use";
import Title from "./EscrowDetails/Title";
import TypeOfEscrow from "./EscrowDetails/TypeOfEscrow";
import HeroImage from "./HeroImage";
import Preview from "./Preview";
import Deadline from "./Terms/Deadline";
import Deliverable from "./Terms/Deliverable";
import Notifications from "./Terms/Notifications";
import Payment from "./Terms/Payment";
import Timeline from "./Timeline";
import { useAccount } from "wagmi";
import ConnectWallet from "components/ConnectWallet";
import { DEFAULT_CHAIN } from "consts/chains";
import { EnsureAuth } from "components/EnsureAuth";
import clsx from "clsx";
import { LG_BREAKPOINT } from "src/styles/breakpoints";

const NewTransaction: React.FC = () => {
  const location = useLocation();
  const { width } = useWindowSize();
  const { isConnected, chain } = useAccount();
  const isPreviewPage = location.pathname.includes("/preview");
  const isMobileView = width <= LG_BREAKPOINT;
  const isOnSupportedChain = chain?.id === DEFAULT_CHAIN;

  return (
    <>
      {!isPreviewPage || isMobileView ? <HeroImage /> : null}
      <div
        className={clsx(
          "w-full max-w-landscape mx-auto bg-klerosUIComponentsLightBackground",
          "px-4 pt-6 pb-10 lg:px-fluid-0-132 lg:pt-8 lg:pb-[60px]"
        )}
      >
        {isConnected && isOnSupportedChain && !isPreviewPage ? <Timeline /> : null}
        {isConnected && isOnSupportedChain ? (
          <EnsureAuth message={"Sign a message to verify yourself."} buttonText="Verify">
            <div className="flex justify-center">
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
            </div>
          </EnsureAuth>
        ) : (
          <div className="flex flex-col gap-4 items-center text-center text-klerosUIComponentsPrimaryText">
            To create a new escrow transaction, connect first and switch to the supported chain
            <ConnectWallet />
          </div>
        )}
      </div>
    </>
  );
};

export default NewTransaction;
