import React from "react";
import Header from "pages/NewTransaction/Header";
import styled from "styled-components";
import TextField from "./TextField";
import NavigationButtons from "pages/NewTransaction/NavigationButtons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title: React.FC = () => {
  return (
    <Container>
      <Header text="Title" />
      <TextField />
      <NavigationButtons prevRoute="/new-transaction/escrow-type" nextRoute="/new-transaction/deliverable" />
    </Container>
  );
};
export default Title;
