import React from "react";
import { DropdownSelect } from "@kleros/ui-components-library";
import styled from "styled-components";

const StyledDropdownSelect = styled(DropdownSelect)`
  button {
    height: 45px;
  }
`;

interface IToken {
  token: string;
  setToken: (value: string) => void;
}

const Token: React.FC<IToken> = ({ token, setToken }) => {
  const handleTokenChange = (value: string | number) => {
    setToken(value.toString());
  };

  return (
    <StyledDropdownSelect
      items={[
        { text: "xDAI", dot: "red", value: "xDAI" },
        { text: "ETH", dot: "blue", value: "ETH" },
      ]}
      callback={handleTokenChange}
    />
  );
};

export default Token;
