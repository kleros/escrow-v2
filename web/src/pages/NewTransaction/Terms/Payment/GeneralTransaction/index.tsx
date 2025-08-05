import React from "react";
import styled from "styled-components";
import Header from "pages/NewTransaction/Header";
import NavigationButtons from "../../../NavigationButtons";
import DestinationAddress from "../DestinationAddress";
import ToDivider from "../ToDivider";
import TokenAndAmount from "./TokenAndAmount";
import BuyerAddress from "../BuyerAddress";
import { useNewTransactionContext } from "context/NewTransactionContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GeneralTransaction: React.FC = () => {
  const {
    sendingQuantity,
    setSendingQuantity,
    sellerAddress,
    setSellerAddress,
  } = useNewTransactionContext();

  return (
    <Container>
      <Header text="I am paying" />
      <TokenAndAmount quantity={sendingQuantity} setQuantity={setSendingQuantity} />
      <BuyerAddress />
      <ToDivider />
      <DestinationAddress recipientAddress={sellerAddress} setRecipientAddress={setSellerAddress} />
      <NavigationButtons prevRoute="/new-transaction/deliverable" nextRoute="/new-transaction/deadline" />
    </Container>
  );
};

export default GeneralTransaction;
