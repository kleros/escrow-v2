import React, { useRef } from "react";
import Description from "./Description";
import { Overlay } from "components/Overlay";
import { useClickAway } from "react-use";
import Buttons from "./Buttons";
import FeeRequired from "./FeeRequired";
import StyledModal from "../StyledModal";
interface IRaiseDisputeModal {
  toggleModal: () => void;
  arbitrationCost: bigint;
}

const RaiseDisputeModal: React.FC<IRaiseDisputeModal> = ({ toggleModal, arbitrationCost }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <Overlay>
      <StyledModal className="gap-8" ref={containerRef}>
        <h1 className="m-0">Raise a dispute</h1>
        <Description />
        <FeeRequired {...{ arbitrationCost }} />
        <Buttons {...{ toggleModal, arbitrationCost }} />
      </StyledModal>
    </Overlay>
  );
};

export default RaiseDisputeModal;
