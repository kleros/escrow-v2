import React from "react";
import styled from "styled-components";
import EscrowOptions from "./EscrowOptions";
import Header from "pages/NewTransaction/Header";
import Info from "./Info";
import NavigationButtons from "../../NavigationButtons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TypeOfEscrow: React.FC = () => {
  return (
    <Container>
      <Header text="What kind of escrow do you want to create?" />
      <EscrowOptions />
      <Info />
      <NavigationButtons prevRoute="" nextRoute="/new-transaction/title" />
    </Container>
  );
};

export default TypeOfEscrow;
