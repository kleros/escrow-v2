import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import PaymentReleased from "components/Popup/PaymentReleased";

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
