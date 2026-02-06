import React from "react";
import PreviousButton from "./PreviousButton";
import NextButton from "./NextButton";
import DepositPaymentButton from "./DepositPaymentButton";

interface NavigationButtonsProps {
  prevRoute: string;
  nextRoute?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ prevRoute, nextRoute }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6">
      <PreviousButton prevRoute={prevRoute} />
      {prevRoute === "/new-transaction/notifications" ? (
        <DepositPaymentButton />
      ) : (
        <NextButton nextRoute={nextRoute ?? ""} />
      )}
    </div>
  );
};

export default NavigationButtons;
