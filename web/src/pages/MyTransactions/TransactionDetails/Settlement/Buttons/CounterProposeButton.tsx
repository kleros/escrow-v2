import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import ProposeSettlementModal from "pages/MyTransactions/Modal/ProposeSettlementModal";

const CounterProposeButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button text={"Counter-propose"} onClick={toggleModal} />
      {isModalOpen ? <ProposeSettlementModal text="Counter-propose" toggleModal={toggleModal} /> : null}
    </>
  );
};
export default CounterProposeButton;
