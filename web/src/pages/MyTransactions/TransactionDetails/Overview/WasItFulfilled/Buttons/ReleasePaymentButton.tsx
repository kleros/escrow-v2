import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import PaymentReleased from "components/Popup/PaymentReleased";

const ReleasePaymentButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button text={"Yes. Release full payment"} onClick={toggleModal} />
      {isModalOpen ? <PaymentReleased toggleModal={toggleModal} /> : null}
    </>
  );
};
export default ReleasePaymentButton;
