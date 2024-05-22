import React, { useState } from "react";
import { Button, Field } from "@kleros/ui-components-library";
import { Alchemy } from "alchemy-sdk";
import { fetchTokenInfo } from "utils/fetchTokenInfo";
import { validateAddress } from "utils/validateAddress";

interface IAddCustomTokenTab {
  setTokens: (tokens: any[]) => void;
  setActiveTab: (tab: string) => void;
  alchemyInstance: Alchemy;
}

const AddCustomTokenTab: React.FC<IAddCustomTokenTab> = ({ setTokens, setActiveTab, alchemyInstance }) => {
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
      const info = await fetchTokenInfo(customToken, alchemyInstance);
      if (info.symbol === "Unknown") {
        throw new Error("Token information not found");
      }

      setTokens((prevTokens) => {
        const newTokens = [...prevTokens, { symbol: info.symbol, address: customToken, logo: info.logo }];
        localStorage.setItem("tokens", JSON.stringify(newTokens));
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
