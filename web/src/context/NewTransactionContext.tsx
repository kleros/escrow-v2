import React, { createContext, useState, useContext } from "react";

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
  const [escrowType, setEscrowType] = useState("general");
  const [escrowTitle, setEscrowTitle] = useState("");
  const [deliverableText, setDeliverableText] = useState("");
  const [deliverableFile, setDeliverableFile] = useState<File>();
  const [paymentQuantity, setPaymentQuantity] = useState<string>("");
  const [paymentToken, setPaymentToken] = useState<string>("");
  const [paymentRecipientAddress, setPaymentRecipientAddress] = useState<string>("");
  const [deadline, setDeadline] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");

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
