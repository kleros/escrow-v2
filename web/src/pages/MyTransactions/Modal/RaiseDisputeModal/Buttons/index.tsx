import React from "react";
import { Button } from "@kleros/ui-components-library";
import RaiseDisputeButton from "pages/MyTransactions/TransactionDetails/PreviewCardButtons/RaiseDisputeButton";
interface IButtons {
  toggleModal: () => void;
  arbitrationCost: bigint;
}

const Buttons: React.FC<IButtons> = ({ toggleModal, arbitrationCost }) => {
  return (
    <div className="flex flex-wrap justify-between gap-4 w-full">
      <Button variant="secondary" text="Return" onPress={toggleModal} />
      <RaiseDisputeButton buttonText="Raise a dispute" {...{ toggleModal, arbitrationCost }} />
    </div>
  );
};
export default Buttons;
