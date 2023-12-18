import React, { useRef } from "react";
import { StyledModal } from "components/Modal/StyledModal";
import VerifiedLogo from "./VerifiedLogo";
import Header from "./Header";
import Description from "./Description";
import CloseButton from "./CloseButton";
import { useFocusOutside } from "hooks/useFocusOutside";
import { Overlay } from "components/Overlay";

interface IPaymentReleased {
  toggleModal: () => void;
}

const PaymentReleased: React.FC<IPaymentReleased> = ({ toggleModal }) => {
  const containerRef = useRef(null);
  useFocusOutside(containerRef, () => {
    toggleModal();
  });

  return (
    <>
      <Overlay />
      <StyledModal ref={containerRef}>
        <VerifiedLogo />
        <Header />
        <Description />
        <CloseButton toggleModal={toggleModal} />
      </StyledModal>
    </>
  );
};
export default PaymentReleased;
