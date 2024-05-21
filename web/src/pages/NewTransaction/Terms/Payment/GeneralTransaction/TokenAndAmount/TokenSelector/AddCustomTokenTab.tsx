import React, { useState } from "react";
import { Button, Field } from "@kleros/ui-components-library";
import { fetchTokenInfo } from "utils/fetchTokenInfo";
import { validateAddress } from "utils/validateAddress";

interface IAddCustomTokenTab {
  setOwnedTokens: (tokens: any[]) => void;
  setActiveTab: (tab: string) => void;
  alchemy: any;
}

const AddCustomTokenTab: React.FC<IAddCustomTokenTab> = ({ setOwnedTokens, setActiveTab, alchemy }) => {
  const [customToken, setCustomToken] = useState<string>("");
  const [customTokenError, setCustomTokenError] = useState<string>("");

  const handleCustomTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 42) {
      setCustomToken(value);
    }
  };

  const handleAddCustomToken = async () => {
    try {
      const info = await fetchTokenInfo(alchemy, customToken);
      if (info.symbol === "Unknown") {
        throw new Error("Token information not found");
      }

      setOwnedTokens((prevTokens) => {
        const newTokens = [...prevTokens, { label: info.symbol, value: customToken, logo: info.logo }];
        localStorage.setItem("ownedTokens", JSON.stringify(newTokens));
        return newTokens;
      });
      setCustomToken("");
      setActiveTab("tokens");
      setCustomTokenError("");
    } catch (error) {
      setCustomTokenError("Token information not found");
    }
  };

  return (
    <div>
      <Field
        type="text"
        value={customToken}
        onChange={handleCustomTokenChange}
        placeholder="Enter token address"
        variant={!validateAddress(customToken) ? "error" : undefined}
        message={!validateAddress(customToken) ? "Address not valid" : customTokenError}
      />
      <Button disabled={!validateAddress(customToken)} onClick={handleAddCustomToken} text="Add Token" />
    </div>
  );
};

export default AddCustomTokenTab;
