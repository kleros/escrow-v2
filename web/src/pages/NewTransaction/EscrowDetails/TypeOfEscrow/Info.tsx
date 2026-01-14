import React from "react";
import { AlertMessage } from "@kleros/ui-components-library";
import { useNewTransactionContext } from "context/NewTransactionContext";

const Info: React.FC = () => {
  const { escrowType } = useNewTransactionContext();

  return (
    <AlertMessage
      className="lg:w-fluid-342-618"
      variant="info"
      title={escrowType === "general" ? "General Escrow" : "Crypto Swap"}
      msg={
        escrowType === "general"
          ? "Hiring an outside contractor? Making a P2P or OTC trade? Use the " +
            "General Escrow to safeguard your transactions. Define the agreement " +
            "under your own terms. Protected by Kleros Court to ensure a fair trade."
          : "Want to protect your crypto transaction? Use this option to create a " +
            "safe cross-chain swap. One person escrows an asset based on " +
            "Ethereum and the funds are released once assets on another " +
            "blockchain have been moved."
      }
    />
  );
};

export default Info;
