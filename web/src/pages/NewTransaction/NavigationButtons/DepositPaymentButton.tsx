import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";

const StyledButton = styled(Button)``;

const DepositPaymentButton: React.FC = () => {
  return <StyledButton text="Deposit the Payment"></StyledButton>;
};

export default DepositPaymentButton;
