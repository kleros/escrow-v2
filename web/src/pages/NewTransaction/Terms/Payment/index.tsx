import React from "react";
import styled from "styled-components";
import Header from "components/Header";
import NavigationButtons from "../../NavigationButtons";
import DestinationAddress from "./DestinationAddress";
import ToDivider from "./ToDivider";
import TokenAndAmount from "./TokenAndAmount";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Payment: React.FC = () => {
  return (
    <Container>
      <Header text="I am paying" />
      <TokenAndAmount />
      <ToDivider />
      <DestinationAddress />
      <NavigationButtons prevRoute="/newTransaction/deliverable" nextRoute="/newTransaction/deadline" />
    </Container>
  );
};
export default Payment;
