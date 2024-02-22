import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import RaiseDisputeModal from "pages/MyTransactions/Modal/RaiseDisputeModal";

const OpenModalRaiseDisputeButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="secondary" text={"Raise a dispute"} onClick={toggleModal} />
      {isModalOpen ? <RaiseDisputeModal toggleModal={toggleModal} /> : null}
    </>
  );
};
export default OpenModalRaiseDisputeButton;
