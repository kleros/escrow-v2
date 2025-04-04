import React from "react";
import { Button } from "@kleros/ui-components-library";

interface ICloseButton {
  toggleModal: () => void;
}

const CloseButton: React.FC<ICloseButton> = ({ toggleModal }) => {
  return <Button variant="secondary" text="Close" onPress={toggleModal} />;
};
export default CloseButton;
