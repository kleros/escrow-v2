import React from "react";
import { BigNumberField } from "@kleros/ui-components-library";

interface IAmount {
  quantity: string;
  setQuantity: (value: string) => void;
}

const Amount: React.FC<IAmount> = ({ quantity, setQuantity }) => {
  return <BigNumberField value={quantity} onChange={(val) => setQuantity(val.toString())} placeholder="eg. 3.6" />;
};
export default Amount;
