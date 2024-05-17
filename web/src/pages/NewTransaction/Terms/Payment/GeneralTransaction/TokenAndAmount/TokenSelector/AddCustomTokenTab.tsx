import React from "react";
import { Button, Field } from "@kleros/ui-components-library";

interface IAddCustomTokenTab {
  customToken: string;
  setCustomToken: (value: string) => void;
  handleAddCustomToken: () => void;
  validateAddress: (address: string) => boolean;
}

const AddCustomTokenTab: React.FC<IAddCustomTokenTab> = ({
  customToken,
  setCustomToken,
  handleAddCustomToken,
  validateAddress,
}) => {
  const handleCustomTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomToken(e.target.value);
  };

  return (
    <div>
      <Field type="text" value={customToken} onChange={handleCustomTokenChange} placeholder="Enter token address" />
      <Button onClick={handleAddCustomToken} text="Add Token" />
    </div>
  );
};

export default AddCustomTokenTab;
