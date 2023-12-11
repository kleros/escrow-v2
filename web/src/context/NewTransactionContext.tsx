import React, { createContext, useState, useContext, useEffect } from "react";

interface INewTransactionContext {
  escrowType: string;
  setEscrowType: (type: string) => void;
  escrowTitle: string;
  setEscrowTitle: (title: string) => void;
  deliverableText: string;
  setDeliverableText: (deliverableText: string) => void;
  deliverableFile: string;
  setDeliverableFile: (deliverableFile: File) => void;
  paymentQuantity: string;
  setPaymentQuantity: (quantity: string) => void;
  paymentToken: string;
  setPaymentToken: (token: string) => void;
  paymentRecipientAddress: string;
  setPaymentRecipientAddress: (address: string) => void;
  deadline: string;
  setDeadline: (deadline: string) => void;
  notificationEmail: string;
  setNotificationEmail: (email: string) => void;
}

const NewTransactionContext = createContext<INewTransactionContext>({
  escrowType: "",
  setEscrowType: () => {},
  escrowTitle: "",
  setEscrowTitle: () => {},
  deliverableText: "",
  setDeliverableText: () => {},
  deliverableFile: "",
  setDeliverableFile: () => {},
  paymentQuantity: "",
  setPaymentQuantity: () => {},
  paymentToken: "",
  setPaymentToken: () => {},
  paymentRecipientAddress: "",
  setPaymentRecipientAddress: () => {},
  deadline: "",
  setDeadline: () => {},
  notificationEmail: "",
  setNotificationEmail: () => {},
});

export const useNewTransactionContext = () => useContext(NewTransactionContext);

export const NewTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [escrowType, setEscrowType] = useState<string>(localStorage.getItem("escrowType") || "general");
  const [escrowTitle, setEscrowTitle] = useState<string>(localStorage.getItem("escrowTitle") || "");
  const [deliverableText, setDeliverableText] = useState<string>(localStorage.getItem("deliverableText") || "");
  const [paymentQuantity, setPaymentQuantity] = useState<string>(localStorage.getItem("paymentQuantity") || "");
  const [paymentToken, setPaymentToken] = useState<string>(localStorage.getItem("paymentToken") || "");
  const [deliverableFile, setDeliverableFile] = useState<File>(localStorage.getItem("deliverableFile") || "");
  const [paymentRecipientAddress, setPaymentRecipientAddress] = useState<string>(
    localStorage.getItem("paymentRecipientAddress") || ""
  );
  const [deadline, setDeadline] = useState<string>(localStorage.getItem("deadline") || "");
  const [notificationEmail, setNotificationEmail] = useState<string>(localStorage.getItem("notificationEmail") || "");

  useEffect(() => {
    localStorage.setItem("escrowType", escrowType);
    localStorage.setItem("escrowTitle", escrowTitle);
    localStorage.setItem("deliverableText", deliverableText);
    localStorage.setItem("paymentQuantity", paymentQuantity);
    localStorage.setItem("paymentToken", paymentToken);
    localStorage.setItem("deliverableFile", deliverableFile);
    localStorage.setItem("paymentRecipientAddress", paymentRecipientAddress);
    localStorage.setItem("deadline", deadline);
    localStorage.setItem("notificationEmail", notificationEmail);
  }, [
    escrowType,
    escrowTitle,
    deliverableText,
    paymentQuantity,
    paymentToken,
    deliverableFile,
    paymentRecipientAddress,
    deadline,
    notificationEmail,
  ]);

  return (
    <NewTransactionContext.Provider
      value={{
        escrowType,
        setEscrowType,
        escrowTitle,
        setEscrowTitle,
        deliverableText,
        setDeliverableText,
        deliverableFile,
        setDeliverableFile,
        paymentQuantity,
        setPaymentQuantity,
        paymentToken,
        setPaymentToken,
        paymentRecipientAddress,
        setPaymentRecipientAddress,
        deadline,
        setDeadline,
        notificationEmail,
        setNotificationEmail,
      }}
    >
      {children}
    </NewTransactionContext.Provider>
  );
};
