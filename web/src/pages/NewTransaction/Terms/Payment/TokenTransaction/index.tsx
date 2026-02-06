import React from "react";
import Header from "pages/NewTransaction/Header";
import NavigationButtons from "../../../NavigationButtons";
import DestinationAddress from "../DestinationAddress";
import ToDivider from "../ToDivider";
import TokenAndAmount from "./TokenAndAmount";

interface ITokenTransaction {
  headerText: string;
  prevRoute: string;
  nextRoute: string;
  quantity: string;
  setQuantity: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
}

const TokenTransaction: React.FC<ITokenTransaction> = ({
  headerText,
  prevRoute,
  nextRoute,
  quantity,
  setQuantity,
  token,
  setToken,
  recipientAddress,
  setRecipientAddress,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Header text={headerText} />
      <TokenAndAmount quantity={quantity} setQuantity={setQuantity} token={token} setToken={setToken} />
      <ToDivider />
      <DestinationAddress recipientAddress={recipientAddress} setRecipientAddress={setRecipientAddress} />
      <NavigationButtons prevRoute={prevRoute} nextRoute={nextRoute} />
    </div>
  );
};

export default TokenTransaction;
