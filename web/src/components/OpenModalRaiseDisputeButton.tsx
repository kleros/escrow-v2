import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import RaiseDisputeModal from "pages/MyTransactions/Modal/RaiseDisputeModal";

interface IOpenModalRaiseDisputeButton {
  arbitrationCost: bigint;
}

const OpenModalRaiseDisputeButton: React.FC<IOpenModalRaiseDisputeButton> = ({ arbitrationCost }) => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="secondary" text={"Raise a dispute"} onPress={toggleModal} />
      <RaiseDisputeModal isOpen={isModalOpen} toggleModal={toggleModal} arbitrationCost={arbitrationCost} />
    </>
  );
};
export default OpenModalRaiseDisputeButton;
