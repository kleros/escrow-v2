import React from "react";
import styled from "styled-components";
import ViewCaseButton from "./ViewCaseButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

const Buttons: React.FC = () => {
  return (
    <Container>
      <ViewCaseButton />
    </Container>
  );
};
export default Buttons;
