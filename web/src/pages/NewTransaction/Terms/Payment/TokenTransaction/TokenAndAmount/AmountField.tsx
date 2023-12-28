import React from "react";
import { Field } from "@kleros/ui-components-library";

interface IAmount {
  quantity: string;
  setQuantity: (value: string) => void;
}

const Amount: React.FC<IAmount> = ({ quantity, setQuantity }) => {
  const handleWrite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  return <Field value={quantity} onChange={handleWrite} type="number" placeholder="eg. 3.6" />;
};
export default Amount;
