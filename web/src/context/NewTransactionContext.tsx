import React, { createContext, useState, useContext, useEffect } from "react";

export interface IToken {
  symbol: string;
  address: string;
  logo: string;
}

interface INewTransactionContext {
  escrowType: string;
  setEscrowType: (type: string) => void;
  escrowTitle: string;
  setEscrowTitle: (title: string) => void;
  deliverableText: string;
  setDeliverableText: (deliverableText: string) => void;
  deliverableFile: File | undefined;
  setDeliverableFile: (deliverableFile: File | undefined) => void;
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
  sellerAddress: string;
  setSellerAddress: (address: string) => void;
  sendingQuantity: string;
  setSendingQuantity: (quantity: string) => void;
  sendingToken: IToken;
  setSendingToken: (token: IToken) => void;
  buyerAddress: string;
  setBuyerAddress: (address: string) => void;
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
  deliverableFile: undefined,
  setDeliverableFile: () => {},
  extraDescriptionUri: "",
  setExtraDescriptionUri: () => {},
  receivingQuantity: "",
  setReceivingQuantity: () => {},
  receivingToken: "",
  setReceivingToken: () => {},
  sellerAddress: "",
  setSellerAddress: () => {},
  sendingQuantity: "",
  setSendingQuantity: () => {},
  sendingToken: { address: "native", symbol: "", logo: "" },
  setSendingToken: () => {},
  buyerAddress: "",
  setBuyerAddress: () => {},
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
  const [deliverableFile, setDeliverableFile] = useState<File | undefined>();
  const [transactionUri, setTransactionUri] = useState<string>(localStorage.getItem("transactionUri") || "");
  const [extraDescriptionUri, setExtraDescriptionUri] = useState<string>(
    localStorage.getItem("extraDescriptionUri") || ""
  );
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [hasSufficientNativeBalance, setHasSufficientNativeBalance] = useState<boolean>(true);
  const [receivingQuantity, setReceivingQuantity] = useState<string>(localStorage.getItem("receivingQuantity") || "");
  const [receivingToken, setReceivingToken] = useState<string>(localStorage.getItem("receivingToken") || "");
  const [sellerAddress, setSellerAddress] = useState<string>(localStorage.getItem("sellerAddress") || "");
  const [sendingQuantity, setSendingQuantity] = useState<string>(localStorage.getItem("sendingQuantity") || "");
  const [sendingToken, setSendingToken] = useState<IToken>(
    JSON.parse(localStorage.getItem("sendingToken")) || { address: "native", symbol: "", logo: "" }
  );
  const [buyerAddress, setBuyerAddress] = useState<string>(localStorage.getItem("buyerAddress") || "");
  const [isRecipientAddressResolved, setIsRecipientAddressResolved] = useState(false);
  const [deadline, setDeadline] = useState<string>(localStorage.getItem("deadline") || "");
  const [notificationEmail, setNotificationEmail] = useState<string>(localStorage.getItem("notificationEmail") || "");

  const resetContext = () => {
    setEscrowType("general");
    setEscrowTitle("");
    setDeliverableText("");
    setDeliverableFile(undefined);
    setExtraDescriptionUri("");
    setTransactionUri("");
    setIsFileUploading(false);
    setReceivingQuantity("");
    setReceivingToken("");
    setSellerAddress("");
    setSendingQuantity("");
    setSendingToken({ address: "native", symbol: "", logo: "" });
    setBuyerAddress("");
    setDeadline("");
    setNotificationEmail("");
    setHasSufficientNativeBalance(true);
  };

  useEffect(() => {
    localStorage.setItem("escrowType", escrowType);
    localStorage.setItem("escrowTitle", escrowTitle);
    localStorage.setItem("deliverableText", deliverableText);
    localStorage.setItem("extraDescriptionUri", extraDescriptionUri);
    localStorage.setItem("transactionUri", transactionUri);
    localStorage.setItem("receivingQuantity", receivingQuantity);
    localStorage.setItem("receivingToken", receivingToken);
    localStorage.setItem("buyerAddress", buyerAddress);
    localStorage.setItem("sendingQuantity", sendingQuantity);
    localStorage.setItem("sendingToken", JSON.stringify(sendingToken));
    localStorage.setItem("sellerAddress", sellerAddress);
    localStorage.setItem("deadline", deadline);
    localStorage.setItem("notificationEmail", notificationEmail);
  }, [
    escrowType,
    escrowTitle,
    deliverableText,
    extraDescriptionUri,
    transactionUri,
    receivingQuantity,
    receivingToken,
    buyerAddress,
    sendingQuantity,
    sendingToken,
    sellerAddress,
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
        buyerAddress,
        setBuyerAddress,
        sendingQuantity,
        setSendingQuantity,
        hasSufficientNativeBalance,
        setHasSufficientNativeBalance,
        sendingToken,
        setSendingToken,
        sellerAddress,
        setSellerAddress,
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
