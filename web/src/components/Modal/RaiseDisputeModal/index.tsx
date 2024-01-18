import React, { useRef } from "react";
import Description from "./Description";
import { Overlay } from "components/Overlay";
import Header from "./Header";
import { useClickAway } from "react-use";
import AmountClaimed from "./AmountClaimed";
import Buttons from "./Buttons";
import FeeRequired from "./FeeRequired";
import { StyledModal } from "../StyledModal";
import styled from "styled-components";
import { TransactionDetailsFragment } from "src/graphql/graphql";

const ReStyledModal = styled(StyledModal)`
  gap: 32px;
`;

interface IRaiseDisputeModal {
  toggleModal: () => void;
  transactionData: TransactionDetailsFragment;
}

const RaiseDisputeModal: React.FC<IRaiseDisputeModal> = ({ toggleModal, transactionData }) => {
  const containerRef = useRef(null);
  useClickAway(containerRef, () => toggleModal());

  return (
    <>
      <Overlay />
      <ReStyledModal ref={containerRef}>
        <Header />
        <Description />
        {/* <AmountClaimed /> */}
        <FeeRequired />
        <Buttons toggleModal={toggleModal} transactionData={transactionData} />
      </ReStyledModal>
    </>
  );
};

export default RaiseDisputeModal;
