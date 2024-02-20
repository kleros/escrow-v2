import React from "react";
import { useToggle } from "react-use";
import { Button } from "@kleros/ui-components-library";
import PaymentReleased from "pages/MyTransactions/Modal/PaymentReleased";

const AcceptButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);
  return (
    <>
      <Button text={"Accept"} onClick={toggleModal} />
      {isModalOpen ? <PaymentReleased toggleModal={toggleModal} /> : null}
    </>
  );
};

export default AcceptButton;
