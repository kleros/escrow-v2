import React from "react";
import styled from "styled-components";
import AttachedFile from "./AttachedFile";
import Description from "./Description";
import Header from "./Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Terms: React.FC = () => {
  return (
    <Container>
      <Header />
      <Description />
      <AttachedFile />
    </Container>
  );
};
export default Terms;
