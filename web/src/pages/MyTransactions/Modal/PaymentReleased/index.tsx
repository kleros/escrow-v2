import React from "react";
import Header from "./Header";
import Description from "./Description";
import CheckCircleFull from "svgs/icons/check-circle-full.svg";
import { Button, Modal } from "@kleros/ui-components-library";
import { baseModalStyle } from "src/styles/modalStyles";

interface IPaymentReleased {
  isOpen: boolean;
  toggleModal: () => void;
}

const PaymentReleased: React.FC<IPaymentReleased> = ({ isOpen, toggleModal }) => {
  return (
    <Modal className={baseModalStyle} isOpen={isOpen} isDismissable onOpenChange={toggleModal}>
      <CheckCircleFull className="mb-3" />
      <Header />
      <Description />
      <Button variant="secondary" text="Close" onPress={toggleModal} />
    </Modal>
  );
};
export default PaymentReleased;
