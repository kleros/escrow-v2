import React from "react";
import GeneralEscrow from "./GeneralEscrow";
// import CryptoSwap from "./CryptoSwap";

const EscrowOptions: React.FC = () => {
  return (
    <div className="flex flex-row justify-center gap-6 mb-8">
      <GeneralEscrow />
      {/* <CryptoSwap /> */}
    </div>
  );
};
export default EscrowOptions;
