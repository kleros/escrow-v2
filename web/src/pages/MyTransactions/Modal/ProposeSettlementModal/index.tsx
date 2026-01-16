import React, { useEffect, useState } from "react";
import AmountField from "./AmountField";
import Buttons from "./Buttons";
import { Modal } from "@kleros/ui-components-library";
import { baseModalStyle } from "~src/styles/modalStyles";

interface IProposeSettlementModal {
  isOpen: boolean;
  toggleModal: () => void;
  text: string;
}

const ProposeSettlementModal: React.FC<IProposeSettlementModal> = ({ isOpen, toggleModal, text }) => {
  const [amountProposed, setAmountProposed] = useState("0");
  const [isAmountValid, setIsAmountValid] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setAmountProposed("0");
      setIsAmountValid(true);
    }
  }, [isOpen]);

  return (
    <Modal className={baseModalStyle} isOpen={isOpen} isDismissable onOpenChange={toggleModal}>
      <h1 className="m-0">{text}</h1>
      <p className="m-0 mb-8 text-klerosUIComponentsSecondaryText">How much should be paid?</p>
      <AmountField {...{ amountProposed, setAmountProposed, setIsAmountValid }} />
      <Buttons {...{ toggleModal, amountProposed, isAmountValid }} />
    </Modal>
  );
};

export default ProposeSettlementModal;
