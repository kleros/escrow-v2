import React from "react";
import { DropdownSelect, NumberField } from "@kleros/ui-components-library";

interface ITokenAndAmount {
  quantity: string;
  setQuantity: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
}

const TokenAndAmount: React.FC<ITokenAndAmount> = ({ quantity, setQuantity, token, setToken }) => {
  return (
    <div className="flex flex-col gap-6 items-center mb-fluid-24-18 lg:flex-row">
      <NumberField
        placeholder="eg. 3.6"
        value={Number(quantity) || 0}
        minValue={0}
        onChange={(value) => setQuantity(value.toString())}
        formatOptions={{
          //Prevent automatic rounding of very small amounts
          minimumFractionDigits: 0,
          maximumFractionDigits: 18,
        }}
      />
      <DropdownSelect
        defaultSelectedKey={token}
        items={[
          { id: "xDAI", text: "xDAI", dot: "red", itemValue: "xDAI" },
          { id: "ETH", text: "ETH", dot: "blue", itemValue: "ETH" },
        ]}
        callback={(value) => setToken(value.itemValue)}
      />
    </div>
  );
};
export default TokenAndAmount;
