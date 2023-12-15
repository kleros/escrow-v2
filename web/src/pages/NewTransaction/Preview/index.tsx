import React from "react";
import styled from "styled-components";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";
import PreviewCard from "components/PreviewCard";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 ${responsiveSize(24, 136)};
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
