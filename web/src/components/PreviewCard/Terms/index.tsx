import React from "react";
import styled from "styled-components";
import { useNewTransactionContext } from "context/NewTransactionContext";
import AttachedFile from "./AttachedFile";
import Description from "./Description";
import Header from "./Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Terms: React.FC = () => {
  const { deliverableFile } = useNewTransactionContext();

  return (
    <Container>
      <Header />
      <Description />
      {deliverableFile ? <AttachedFile /> : null}
    </Container>
  );
};
export default Terms;
