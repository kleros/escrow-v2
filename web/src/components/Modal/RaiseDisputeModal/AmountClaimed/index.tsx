import React from "react";
import styled from "styled-components";
import AmountField from "./AmountField";
import Header from "./Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const AmountClaimed: React.FC = () => {
  return (
    <Container>
      <Header />
      <AmountField />
    </Container>
  );
};
export default AmountClaimed;
