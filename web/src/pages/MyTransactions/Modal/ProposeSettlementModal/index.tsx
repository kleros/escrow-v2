import React, { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Overlay } from "components/Overlay";
import AmountField from "./AmountField";
import Buttons from "./Buttons";
import StyledModal from "../StyledModal";

interface IProposeSettlementModal {
  toggleModal: () => void;
  text: string;
}

const ProposeSettlementModal: React.FC<IProposeSettlementModal> = ({ toggleModal, text }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());
  const [amountProposed, setAmountProposed] = useState("0");
  const [isAmountValid, setIsAmountValid] = useState(true);

  return (
    <Overlay>
      <StyledModal ref={containerRef}>
        <h1 className="m-0">{text}</h1>
        <p className="m-0 mb-8 text-klerosUIComponentsSecondaryText">How much should be paid?</p>
        <AmountField {...{ amountProposed, setAmountProposed, setIsAmountValid }} />
        <Buttons {...{ toggleModal, amountProposed, isAmountValid }} />
      </StyledModal>
    </Overlay>
  );
};

export default ProposeSettlementModal;
