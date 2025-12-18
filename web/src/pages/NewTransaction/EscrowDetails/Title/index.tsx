import React from "react";
import Header from "pages/NewTransaction/Header";
import NavigationButtons from "pages/NewTransaction/NavigationButtons";
import { useNewTransactionContext } from "~src/context/NewTransactionContext";
import { TextField } from "@kleros/ui-components-library";

const Title: React.FC = () => {
  const { escrowTitle, setEscrowTitle } = useNewTransactionContext();

  const handleWrite = (value: string) => {
    setEscrowTitle(value);
  };

  return (
    <div className="flex flex-col items-center">
      <Header text="Title" />
      <TextField
        className="w-[84vw] lg:w-fluid-342-500"
        value={escrowTitle}
        onChange={handleWrite}
        placeholder="e.g. Escrow with John"
      />
      <NavigationButtons prevRoute="/new-transaction/escrow-type" nextRoute="/new-transaction/deliverable" />
    </div>
  );
};
export default Title;
