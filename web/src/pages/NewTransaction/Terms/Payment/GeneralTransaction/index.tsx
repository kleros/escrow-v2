import React from "react";
import Header from "pages/NewTransaction/Header";
import NavigationButtons from "../../../NavigationButtons";
import DestinationAddress from "../DestinationAddress";
import ToDivider from "../ToDivider";
import TokenAndAmount from "./TokenAndAmount";
import BuyerAddress from "../BuyerAddress";
import { useNewTransactionContext } from "context/NewTransactionContext";

const GeneralTransaction: React.FC = () => {
  const { sendingQuantity, setSendingQuantity, sellerAddress, setSellerAddress } = useNewTransactionContext();

  return (
    <div className="flex flex-col items-center">
      <Header text="I am paying" />
      <TokenAndAmount quantity={sendingQuantity} setQuantity={setSendingQuantity} />
      <BuyerAddress />
      <ToDivider />
      <DestinationAddress recipientAddress={sellerAddress} setRecipientAddress={setSellerAddress} />
      <NavigationButtons prevRoute="/new-transaction/deliverable" nextRoute="/new-transaction/deadline" />
    </div>
  );
};

export default GeneralTransaction;
