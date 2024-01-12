import React from "react";
import styled from "styled-components";
import ProposeSettlementButton from "./ProposeSettlementButton";
import RaiseDisputeButton from "./RaiseDisputeButton";
import ReleasePaymentButton from "./ReleasePaymentButton";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 24px;
  justify-content: center;
`;

const Buttons: React.FC = () => {
  return (
    <Container>
      <ReleasePaymentButton />
      {/* <ProposeSettlementButton /> */}
      <RaiseDisputeButton />
    </Container>
  );
};
export default Buttons;
