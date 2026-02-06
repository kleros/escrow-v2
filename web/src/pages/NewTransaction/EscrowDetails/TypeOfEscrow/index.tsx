import React from "react";
import EscrowOptions from "./EscrowOptions";
import Header from "pages/NewTransaction/Header";
import Info from "./Info";
import NavigationButtons from "../../NavigationButtons";

const TypeOfEscrow: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Header text="Create an escrow" />
      {/* <Header text="What kind of escrow do you want to create?" /> */}
      <EscrowOptions />
      <Info />
      <NavigationButtons prevRoute="" nextRoute="/new-transaction/title" />
    </div>
  );
};

export default TypeOfEscrow;
