import React, { useRef } from "react";
import { useClickAway } from "react-use";
import { StyledModal } from "components/Modal/StyledModal";
import VerifiedLogo from "./VerifiedLogo";
import Header from "./Header";
import Description from "./Description";
import CloseButton from "./CloseButton";
import { Overlay } from "components/Overlay";

interface IPaymentReleased {
  toggleModal: () => void;
  amount: string;
  asset: string;
  seller: string;
}

const PaymentReleased: React.FC<IPaymentReleased> = ({ toggleModal, amount, asset, seller }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <>
      <Overlay />
      <StyledModal ref={containerRef}>
        <VerifiedLogo />
        <Header amount={amount} asset={asset} />
        <Description seller={seller} />
        <CloseButton toggleModal={toggleModal} />
      </StyledModal>
    </>
  );
};
export default PaymentReleased;
