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
  return (
    <StyledDropdownSelect
      items={[
        { text: "xDAI", dot: "red", itemValue: "xDAI", id: "xDAI" },
        { text: "ETH", dot: "blue", itemValue: "ETH", id: "ETH" },
      ]}
      callback={(val) => setToken(val.itemValue)}
    />
  );
};

export default Token;
