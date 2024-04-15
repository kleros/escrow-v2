import React, { useRef } from "react";
import { useClickAway } from "react-use";
import { StyledModal } from "pages/MyTransactions/Modal/StyledModal";
import VerifiedLogo from "./VerifiedLogo";
import Header from "./Header";
import Description from "./Description";
import CloseButton from "./CloseButton";
import { Overlay } from "components/Overlay";

interface IPaymentReleased {
  toggleModal: () => void;
}

const PaymentReleased: React.FC<IPaymentReleased> = ({ toggleModal }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

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
