import React, { useRef } from "react";
import Description from "./Description";
import { Overlay } from "components/Overlay";
import Header from "./Header";
import { useClickAway } from "react-use";
import Buttons from "./Buttons";
import FeeRequired from "./FeeRequired";
import { StyledModal } from "../StyledModal";
import styled from "styled-components";

const ReStyledModal = styled(StyledModal)`
  gap: 32px;
`;

interface IRaiseDisputeModal {
  toggleModal: () => void;
  arbitrationCost: bigint;
}

const RaiseDisputeModal: React.FC<IRaiseDisputeModal> = ({ toggleModal, arbitrationCost }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header />
        <Description />
        <FeeRequired {...{ arbitrationCost }} />
        <Buttons {...{ toggleModal, arbitrationCost }} />
      </ReStyledModal>
    </>
  );
};

export default RaiseDisputeModal;
