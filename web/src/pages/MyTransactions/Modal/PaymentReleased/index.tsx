import React, { useRef } from "react";
import { useClickAway } from "react-use";
import StyledModal from "pages/MyTransactions/Modal/StyledModal";
import Header from "./Header";
import Description from "./Description";
import { Overlay } from "components/Overlay";
import CheckCircleFull from "svgs/icons/check-circle-full.svg";
import { Button } from "@kleros/ui-components-library";

interface IPaymentReleased {
  toggleModal: () => void;
}

const PaymentReleased: React.FC<IPaymentReleased> = ({ toggleModal }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <Overlay>
      <StyledModal ref={containerRef}>
        <CheckCircleFull className="mb-3" />
        <Header />
        <Description />
        <Button variant="secondary" text="Close" onPress={toggleModal} />
      </StyledModal>
    </Overlay>
  );
};
export default PaymentReleased;
