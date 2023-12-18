import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import RaiseDisputeModal from "components/Modal/RaiseDisputeModal";

const RaiseDisputeButton: React.FC = () => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="secondary" text={"Raise a dispute"} onClick={toggleModal} />
      {isModalOpen && <RaiseDisputeModal toggleModal={toggleModal} />}
    </>
  );
};
export default RaiseDisputeButton;
