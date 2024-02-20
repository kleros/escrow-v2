import React from "react";
import styled from "styled-components";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import RaiseDisputeModal from "pages/MyTransactions/Modal/RaiseDisputeModal";

const StyledButton = styled(Button)`
  margin-bottom: 32px;
`;

const OpenModalRaiseDisputeButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <StyledButton variant="secondary" text={"Raise a dispute"} onClick={toggleModal} />
      {isModalOpen ? <RaiseDisputeModal toggleModal={toggleModal} /> : null}
    </>
  );
};
export default OpenModalRaiseDisputeButton;
