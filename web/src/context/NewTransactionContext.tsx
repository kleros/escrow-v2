import React, { createContext, useState, useContext, useEffect } from "react";

interface INewTransactionContext {
  escrowType: string;
  setEscrowType: (type: string) => void;
  escrowTitle: string;
  setEscrowTitle: (title: string) => void;
  deliverableText: string;
  setDeliverableText: (deliverableText: string) => void;
  deliverableFile: string;
  setDeliverableFile: (deliverableFile: string) => void;
  extraDescriptionUri: string;
  setExtraDescriptionUri: (extraDescriptionUri: string) => void;
  transactionUri: string;
  setTransactionUri: (transactionUri: string) => void;
  isFileUploading: boolean;
  setIsFileUploading: (isFileUploading: boolean) => void;
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
  resetContext: () => void;
  hasSufficientNativeBalance: boolean;
  setHasSufficientNativeBalance: (hasSufficientNativeBalance: boolean) => void;
  isRecipientAddressResolved: boolean;
  setIsRecipientAddressResolved: (isRecipientAddressResolved: boolean) => void;
}

const NewTransactionContext = createContext<INewTransactionContext>({
  escrowType: "",
  setEscrowType: () => {},
  escrowTitle: "",
  setEscrowTitle: () => {},
  deliverableText: "",
  setDeliverableText: () => {},
  transactionUri: "",
  setTransactionUri: () => {},
  isFileUploading: false,
  setIsFileUploading: () => {},
  deliverableFile: "",
  setDeliverableFile: () => {},
  extraDescriptionUri: "",
  setExtraDescriptionUri: () => {},
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
  resetContext: () => {},
  hasSufficientNativeBalance: true,
  setHasSufficientNativeBalance: () => {},
  isRecipientAddressResolved: false,
  setIsRecipientAddressResolved: () => {},
});

export const useNewTransactionContext = () => useContext(NewTransactionContext);

export const NewTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [escrowType, setEscrowType] = useState<string>(localStorage.getItem("escrowType") || "general");
  const [escrowTitle, setEscrowTitle] = useState<string>(localStorage.getItem("escrowTitle") || "");
  const [deliverableText, setDeliverableText] = useState<string>(localStorage.getItem("deliverableText") || "");
  const [deliverableFile, setDeliverableFile] = useState<string>(localStorage.getItem("deliverableFile") || "");
  const [transactionUri, setTransactionUri] = useState<string>(localStorage.getItem("transactionUri") || "");
  const [extraDescriptionUri, setExtraDescriptionUri] = useState<string>(
    localStorage.getItem("extraDescriptionUri") || ""
  );
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [hasSufficientNativeBalance, setHasSufficientNativeBalance] = useState<boolean>(true);
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
  const [isRecipientAddressResolved, setIsRecipientAddressResolved] = useState(false);
  const [deadline, setDeadline] = useState<string>(localStorage.getItem("deadline") || "");
  const [notificationEmail, setNotificationEmail] = useState<string>(localStorage.getItem("notificationEmail") || "");

  const resetContext = () => {
    setEscrowType("general");
    setEscrowTitle("");
    setDeliverableText("");
    setDeliverableFile("");
    setExtraDescriptionUri("");
    setTransactionUri("");
    setIsFileUploading(false);
    setReceivingQuantity("");
    setReceivingToken("");
    setReceivingRecipientAddress("");
    setSendingQuantity("");
    setSendingToken("");
    setSendingRecipientAddress("");
    setDeadline("");
    setNotificationEmail("");
    setHasSufficientNativeBalance(true);
  };

  useEffect(() => {
    localStorage.setItem("escrowType", escrowType);
    localStorage.setItem("escrowTitle", escrowTitle);
    localStorage.setItem("deliverableText", deliverableText);
    localStorage.setItem("deliverableFile", deliverableFile);
    localStorage.setItem("extraDescriptionUri", extraDescriptionUri);
    localStorage.setItem("transactionUri", transactionUri);
    localStorage.setItem("receivingQuantity", receivingQuantity);
    localStorage.setItem("receivingToken", receivingToken);
    localStorage.setItem("receivingRecipientAddress", receivingRecipientAddress);
    localStorage.setItem("sendingQuantity", sendingQuantity);
    localStorage.setItem("sendingToken", sendingToken);
    localStorage.setItem("sendingRecipientAddress", sendingRecipientAddress);
    localStorage.setItem("deadline", deadline);
    localStorage.setItem("notificationEmail", notificationEmail);
  }, [
    escrowType,
    escrowTitle,
    deliverableText,
    deliverableFile,
    extraDescriptionUri,
    transactionUri,
    receivingQuantity,
    receivingToken,
    receivingRecipientAddress,
    sendingQuantity,
    sendingToken,
    sendingRecipientAddress,
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
        extraDescriptionUri,
        setExtraDescriptionUri,
        transactionUri,
        setTransactionUri,
        isFileUploading,
        setIsFileUploading,
        receivingQuantity,
        setReceivingQuantity,
        receivingToken,
        setReceivingToken,
        receivingRecipientAddress,
        setReceivingRecipientAddress,
        sendingQuantity,
        setSendingQuantity,
        hasSufficientNativeBalance,
        setHasSufficientNativeBalance,
        sendingToken,
        setSendingToken,
        sendingRecipientAddress,
        setSendingRecipientAddress,
        isRecipientAddressResolved,
        setIsRecipientAddressResolved,
        deadline,
        setDeadline,
        notificationEmail,
        setNotificationEmail,
        resetContext,
      }}
    >
      {children}
    </NewTransactionContext.Provider>
  );
};
