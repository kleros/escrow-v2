import React from "react";
import { Button } from "@kleros/ui-components-library";
import ProposeSettlementButton from "pages/MyTransactions/TransactionDetails/PreviewCardButtons/ProposeSettlementButton";

interface IButtons {
  toggleModal: () => void;
  amountProposed: string;
  isAmountValid: boolean;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, amountProposed, isAmountValid }) => {
  return (
    <div className="flex flex-wrap justify-center md:justify-between gap-4 w-full">
      <Button variant="secondary" text="Return" onPress={toggleModal} />
      <ProposeSettlementButton buttonText="Propose" {...{ toggleModal, amountProposed, isAmountValid }} />
    </div>
  );
};

export default Buttons;
