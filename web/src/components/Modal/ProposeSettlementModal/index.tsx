import React, { useRef } from "react";
import { useClickAway } from "react-use";
import Description from "./Description";
import { Overlay } from "components/Overlay";
import Header from "./Header";
import AmountField from "./AmountField";
import Buttons from "./Buttons";
import { StyledModal } from "../StyledModal";

interface IProposeSettlementModal {
  toggleModal: () => void;
  text: string;
}

const ProposeSettlementModal: React.FC<IProposeSettlementModal> = ({ toggleModal, text }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <>
      <Overlay />
      <StyledModal ref={containerRef}>
        <Header text={text} />
        <Description />
        <AmountField />
        <Buttons toggleModal={toggleModal} />
      </StyledModal>
    </>
  );
};

export default ProposeSettlementModal;
