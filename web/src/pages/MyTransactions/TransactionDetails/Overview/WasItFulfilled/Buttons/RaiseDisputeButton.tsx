import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useToggle } from "react-use";
import RaiseDisputeModal from "components/Modal/RaiseDisputeModal";
import { TransactionDetailsFragment } from "src/graphql/graphql";

interface IRaiseDisputeButton {
  transactionData: TransactionDetailsFragment;
}

const RaiseDisputeButton: React.FC<IRaiseDisputeButton> = ({ transactionData }) => {
  const [isModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Button variant="secondary" text={"Raise a dispute"} onClick={toggleModal} />
      {isModalOpen ? <RaiseDisputeModal toggleModal={toggleModal} transactionData={transactionData} /> : null}
    </>
  );
};
export default RaiseDisputeButton;
