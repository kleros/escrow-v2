import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import ProposeSettlementModal from "components/Modal/ProposeSettlementModal";

const ProposeSettlementButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="secondary" text={"Propose a settlement"} onClick={toggleModal} />
      {isModalOpen && <ProposeSettlementModal text="Propose a settlement" toggleModal={toggleModal} />}
    </>
  );
};
export default ProposeSettlementButton;
