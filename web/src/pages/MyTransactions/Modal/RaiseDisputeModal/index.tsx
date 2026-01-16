import React from "react";
import clsx from "clsx";
import { Modal } from "@kleros/ui-components-library";
import { baseModalStyle } from "~src/styles/modalStyles";
import Description from "./Description";
import Buttons from "./Buttons";
import FeeRequired from "./FeeRequired";

interface IRaiseDisputeModal {
  isOpen: boolean;
  toggleModal: () => void;
  arbitrationCost: bigint;
}

const RaiseDisputeModal: React.FC<IRaiseDisputeModal> = ({ isOpen, toggleModal, arbitrationCost }) => {
  return (
    <Modal className={clsx(baseModalStyle, "gap-8")} isOpen={isOpen} isDismissable onOpenChange={toggleModal}>
      <h1 className="m-0">Raise a dispute</h1>
      <Description />
      <FeeRequired {...{ arbitrationCost }} />
      <Buttons {...{ toggleModal, arbitrationCost }} />
    </Modal>
  );
};

export default RaiseDisputeModal;
