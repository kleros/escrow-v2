import React from "react";
import styled from "styled-components";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import PreviewCard from "./PreviewCard";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Preview: React.FC = () => {
  return (
    <Container>
      <Header />
      <PreviewCard />
      <NavigationButtons prevRoute="/newTransaction/notifications" nextRoute="/newTransaction/deliverable" />
    </Container>
  );
};

export default Preview;
