import React, { useRef } from "react";
import Description from "./Description";
import { Overlay } from "components/Overlay";
import Header from "./Header";
import AmountClaimed from "./AmountClaimed";
import Buttons from "./Buttons";
import FeeRequired from "./FeeRequired";
import { useFocusOutside } from "hooks/useFocusOutside";
import { StyledModal } from "../StyledModal";
import styled from "styled-components";

const ReStyledModal = styled(StyledModal)`
  gap: 32px;
`;

interface IRaiseDisputeModal {
  toggleModal: () => void;
}

const RaiseDisputeModal: React.FC<IRaiseDisputeModal> = ({ toggleModal }) => {
  const containerRef = useRef(null);
  useFocusOutside(containerRef, () => {
    toggleModal();
  });

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header />
        <Description />
        <AmountClaimed />
        <FeeRequired />
        <Buttons toggleModal={toggleModal} />
      </ReStyledModal>
    </>
  );
};

export default RaiseDisputeModal;
