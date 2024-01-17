import React from "react";
import styled from "styled-components";
import ViewCaseButton from "./ViewCaseButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
`;

interface IButtons {
  disputeID: string;
}

const Buttons: React.FC<IButtons> = ({ disputeID }) => {
  return (
    <Container>
      <ViewCaseButton disputeID={disputeID} />
    </Container>
  );
};
export default Buttons;
