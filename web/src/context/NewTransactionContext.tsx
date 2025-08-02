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
  isBuyerAddressCustom: boolean;
  setIsBuyerAddressCustom: (v: boolean) => void;
  deadline: string;
  setDeadline: (deadline: string) => void;
  notificationEmail: string;
  setNotificationEmail: (email: string) => void;
  resetContext: () => void;
  hasSufficientNativeBalance: boolean;
  setHasSufficientNativeBalance: (v: boolean) => void;
  isRecipientAddressResolved: boolean;
  setIsRecipientAddressResolved: (v: boolean) => void;
  isBuyerAddressResolved: boolean;
  setIsBuyerAddressResolved: (v: boolean) => void;
}

const NewTransactionContext = createContext<INewTransactionContext>({} as INewTransactionContext);

export const useNewTransactionContext = () => useContext(NewTransactionContext);

export const NewTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [escrowType, setEscrowType] = useState(localStorage.getItem("escrowType") || "general");
  const [escrowTitle, setEscrowTitle] = useState(localStorage.getItem("escrowTitle") || "");
  const [deliverableText, setDeliverableText] = useState(localStorage.getItem("deliverableText") || "");
  const [deliverableFile, setDeliverableFile] = useState<File | undefined>();
  const [transactionUri, setTransactionUri] = useState(localStorage.getItem("transactionUri") || "");
  const [extraDescriptionUri, setExtraDescriptionUri] = useState(localStorage.getItem("extraDescriptionUri") || "");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [hasSufficientNativeBalance, setHasSufficientNativeBalance] = useState(true);
  const [receivingQuantity, setReceivingQuantity] = useState(localStorage.getItem("receivingQuantity") || "");
  const [receivingToken, setReceivingToken] = useState(localStorage.getItem("receivingToken") || "");
  const [sellerAddress, setSellerAddress] = useState(localStorage.getItem("sellerAddress") || "");
  const [sendingQuantity, setSendingQuantity] = useState(localStorage.getItem("sendingQuantity") || "");
  const [sendingToken, setSendingToken] = useState<IToken>(
    JSON.parse(localStorage.getItem("sendingToken") ?? "null") || { address: "native", symbol: "", logo: "" }
  );
  const [buyerAddress, setBuyerAddress] = useState(localStorage.getItem("buyerAddress") ?? "");
  const [isBuyerAddressCustom, setIsBuyerAddressCustom] = useState(
    JSON.parse(localStorage.getItem("isBuyerAddressCustom") ?? "false")
  );
  const [isRecipientAddressResolved, setIsRecipientAddressResolved] = useState(false);
  const [isBuyerAddressResolved, setIsBuyerAddressResolved] = useState(false);
  const [deadline, setDeadline] = useState(localStorage.getItem("deadline") || "");
  const [notificationEmail, setNotificationEmail] = useState(localStorage.getItem("notificationEmail") || "");

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
    setIsBuyerAddressCustom(false);
    setDeadline("");
    setNotificationEmail("");
    setHasSufficientNativeBalance(true);
    setIsRecipientAddressResolved(false);
    setIsBuyerAddressResolved(false);
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
    localStorage.setItem("isBuyerAddressCustom", JSON.stringify(isBuyerAddressCustom));
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
    isBuyerAddressCustom,
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
        isBuyerAddressCustom,
        setIsBuyerAddressCustom,
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
        isBuyerAddressResolved,
        setIsBuyerAddressResolved,
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
