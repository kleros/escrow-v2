import React, { createContext, useState, useContext, useEffect } from "react";

interface INewTransactionContext {
  escrowType: string;
  setEscrowType: (type: string) => void;
  escrowTitle: string;
  setEscrowTitle: (title: string) => void;
  deliverableText: string;
  setDeliverableText: (deliverableText: string) => void;
  deliverableFile: File;
  setDeliverableFile: (deliverableFile: File) => void;
  receivingQuantity: string;
  setReceivingQuantity: (quantity: string) => void;
  receivingToken: string;
  setReceivingToken: (token: string) => void;
  receivingRecipientAddress: string;
  setReceivingRecipientAddress: (address: string) => void;
  sendingQuantity: string;
  setSendingQuantity: (quantity: string) => void;
  sendingToken: string;
  setSendingToken: (token: string) => void;
  sendingRecipientAddress: string;
  setSendingRecipientAddress: (address: string) => void;
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
  receivingQuantity: "",
  setReceivingQuantity: () => {},
  receivingToken: "",
  setReceivingToken: () => {},
  receivingRecipientAddress: "",
  setReceivingRecipientAddress: () => {},
  sendingQuantity: "",
  setSendingQuantity: () => {},
  sendingToken: "",
  setSendingToken: () => {},
  sendingRecipientAddress: "",
  setSendingRecipientAddress: () => {},
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
  const [receivingQuantity, setReceivingQuantity] = useState<string>(localStorage.getItem("receivingQuantity") || "");
  const [receivingToken, setReceivingToken] = useState<string>(localStorage.getItem("receivingToken") || "");
  const [receivingRecipientAddress, setReceivingRecipientAddress] = useState<string>(
    localStorage.getItem("receivingRecipientAddress") || ""
  );
  const [sendingQuantity, setSendingQuantity] = useState<string>(localStorage.getItem("sendingQuantity") || "");
  const [sendingToken, setSendingToken] = useState<string>(localStorage.getItem("sendingToken") || "");
  const [sendingRecipientAddress, setSendingRecipientAddress] = useState<string>(
    localStorage.getItem("sendingRecipientAddress") || ""
  );
  const [deliverableFile, setDeliverableFile] = useState<File>(localStorage.getItem("deliverableFile") || "");
  const [deadline, setDeadline] = useState<string>(localStorage.getItem("deadline") || "");
  const [notificationEmail, setNotificationEmail] = useState<string>(localStorage.getItem("notificationEmail") || "");

  useEffect(() => {
    localStorage.setItem("escrowType", escrowType);
    localStorage.setItem("escrowTitle", escrowTitle);
    localStorage.setItem("deliverableText", deliverableText);
    localStorage.setItem("receivingQuantity", receivingQuantity);
    localStorage.setItem("receivingToken", receivingToken);
    localStorage.setItem("receivingRecipientAddress", receivingRecipientAddress);
    localStorage.setItem("sendingQuantity", sendingQuantity);
    localStorage.setItem("sendingToken", sendingToken);
    localStorage.setItem("sendingRecipientAddress", sendingRecipientAddress);
    localStorage.setItem("deliverableFile", deliverableFile);
    localStorage.setItem("deadline", deadline);
    localStorage.setItem("notificationEmail", notificationEmail);
  }, [
    escrowType,
    escrowTitle,
    deliverableText,
    receivingQuantity,
    receivingToken,
    receivingRecipientAddress,
    sendingQuantity,
    sendingToken,
    sendingRecipientAddress,
    deliverableFile,
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
        receivingQuantity,
        setReceivingQuantity,
        receivingToken,
        setReceivingToken,
        receivingRecipientAddress,
        setReceivingRecipientAddress,
        sendingQuantity,
        setSendingQuantity,
        sendingToken,
        setSendingToken,
        sendingRecipientAddress,
        setSendingRecipientAddress,
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
