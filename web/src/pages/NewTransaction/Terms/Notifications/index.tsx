import React from "react";
import Header from "pages/NewTransaction/Header";
import EmailField from "./EmailField";
import NavigationButtons from "../../NavigationButtons";

const Notifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Header text="Subscribe for Email Notifications" />
      <EmailField />
      <NavigationButtons prevRoute="/new-transaction/deadline" nextRoute="/new-transaction/preview" />
    </div>
  );
};
export default Notifications;
