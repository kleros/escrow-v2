import React, { createContext, useContext, useState, ReactNode } from "react";
import { TransactionDetailsFragment } from "src/graphql/graphql";

interface TransactionDetailsContextType {
  transactionDetails: TransactionDetailsFragment | null;
  setTransactionDetails: (details: TransactionDetailsFragment | null) => void;
}

const TransactionDetailsContext = createContext<TransactionDetailsContextType>({
  transactionDetails: null,
  setTransactionDetails: () => {},
});

export const useTransactionDetailsContext = () => {
  const context = useContext(TransactionDetailsContext);
  if (!context) {
    throw new Error("useTransactionDetailsContext must be used within a TransactionDetailsProvider");
  }

  const { transactionDetails, setTransactionDetails } = context;
  return { ...transactionDetails, setTransactionDetails };
};

export const TransactionDetailsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsFragment | null>(null);

  return (
    <TransactionDetailsContext.Provider value={{ transactionDetails, setTransactionDetails }}>
      {children}
    </TransactionDetailsContext.Provider>
  );
};
