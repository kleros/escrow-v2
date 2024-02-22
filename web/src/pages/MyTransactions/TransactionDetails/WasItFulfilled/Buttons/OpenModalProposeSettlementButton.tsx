import React from "react";
import { useToggle } from "react-use";
import { Button } from "@kleros/ui-components-library";
import ProposeSettlementModal from "pages/MyTransactions/Modal/ProposeSettlementModal";

interface IOpenModalProposeSettlementButton {
  buttonText: string;
}

const OpenModalProposeSettlementButton: React.FC<IOpenModalProposeSettlementButton> = ({ buttonText }) => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="secondary" text={buttonText} onClick={toggleModal} />
      {isModalOpen ? <ProposeSettlementModal text="Propose a settlement" toggleModal={toggleModal} /> : null}
    </>
  );
};
export default OpenModalProposeSettlementButton;
