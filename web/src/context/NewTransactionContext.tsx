import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";

export interface IToken {
  symbol: string;
  address: string;
  logo: string;
  decimals?: number;
}

interface INewTransactionContext {
  escrowType: string;
  setEscrowType: (type: string) => void;
  escrowTitle: string;
  setEscrowTitle: (title: string) => void;
  deliverableText: string;
  setDeliverableText: (text: string) => void;
  deliverableFile: File | undefined;
  setDeliverableFile: (file: File | undefined) => void;
  extraDescriptionUri: string;
  setExtraDescriptionUri: (uri: string) => void;
  transactionUri: string;
  setTransactionUri: (uri: string) => void;
  isFileUploading: boolean;
  setIsFileUploading: (v: boolean) => void;
  receivingQuantity: string;
  setReceivingQuantity: (qty: string) => void;
  receivingToken: string;
  setReceivingToken: (token: string) => void;
  sellerAddress: string;
  setSellerAddress: (addr: string) => void;
  sendingQuantity: string;
  setSendingQuantity: (qty: string) => void;
  sendingToken: IToken;
  setSendingToken: (token: IToken) => void;
  buyerAddress: string;
  setBuyerAddress: (addr: string) => void;
  isBuyerAddressCustom: boolean;
  setIsBuyerAddressCustom: (v: boolean) => void;
  deadline: string;
  setDeadline: (d: string) => void;
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

const initialToken: IToken = { address: "native", symbol: "", logo: "" };

const NewTransactionContext = createContext<INewTransactionContext | undefined>(undefined);

export const useNewTransactionContext = () => {
  const context = useContext(NewTransactionContext);
  if (!context) throw new Error("Context Provider not found.");
  return context;
};

export const NewTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [escrowType, setEscrowType] = useLocalStorage("escrowType", "general");
  const [escrowTitle, setEscrowTitle] = useLocalStorage("escrowTitle", "");
  const [deliverableText, setDeliverableText] = useLocalStorage("deliverableText", "");
  const [deliverableFile, setDeliverableFile] = useState<File | undefined>();
  const [transactionUri, setTransactionUri] = useLocalStorage("transactionUri", "");
  const [extraDescriptionUri, setExtraDescriptionUri] = useLocalStorage("extraDescriptionUri", "");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [hasSufficientNativeBalance, setHasSufficientNativeBalance] = useState(true);
  const [receivingQuantity, setReceivingQuantity] = useLocalStorage("receivingQuantity", "");
  const [receivingToken, setReceivingToken] = useLocalStorage("receivingToken", "");
  const [sellerAddress, setSellerAddress] = useLocalStorage("sellerAddress", "");
  const [sendingQuantity, setSendingQuantity] = useLocalStorage("sendingQuantity", "");
  const [sendingToken, setSendingToken] = useLocalStorage("sendingToken", initialToken);
  const [buyerAddress, setBuyerAddress] = useLocalStorage("buyerAddress", "");
  const [isBuyerAddressCustom, setIsBuyerAddressCustom] = useLocalStorage("isBuyerAddressCustom", false);
  const [isRecipientAddressResolved, setIsRecipientAddressResolved] = useState(false);
  const [isBuyerAddressResolved, setIsBuyerAddressResolved] = useState(false);
  const [deadline, setDeadline] = useLocalStorage("deadline", "");
  const [notificationEmail, setNotificationEmail] = useLocalStorage("notificationEmail", "");

  const resetContext = useCallback(() => {
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
    setSendingToken(initialToken);
    setBuyerAddress("");
    setIsBuyerAddressCustom(false);
    setDeadline("");
    setNotificationEmail("");
    setHasSufficientNativeBalance(true);
    setIsRecipientAddressResolved(false);
    setIsBuyerAddressResolved(false);
  }, [
    setEscrowType,
    setEscrowTitle,
    setDeliverableText,
    setExtraDescriptionUri,
    setTransactionUri,
    setReceivingQuantity,
    setReceivingToken,
    setSellerAddress,
    setSendingQuantity,
    setSendingToken,
    setBuyerAddress,
    setIsBuyerAddressCustom,
    setDeadline,
    setNotificationEmail,
  ]);

  const contextValues = useMemo(
    () => ({
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
    }),
    [
      escrowType,
      escrowTitle,
      deliverableText,
      deliverableFile,
      extraDescriptionUri,
      transactionUri,
      isFileUploading,
      receivingQuantity,
      receivingToken,
      buyerAddress,
      isBuyerAddressCustom,
      sendingQuantity,
      hasSufficientNativeBalance,
      sendingToken,
      sellerAddress,
      isRecipientAddressResolved,
      isBuyerAddressResolved,
      deadline,
      notificationEmail,
      resetContext,
    ]
  );

  return <NewTransactionContext.Provider value={contextValues}>{children}</NewTransactionContext.Provider>;
};
