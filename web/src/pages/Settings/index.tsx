import React from "react";
import { Route, Routes } from "react-router-dom";
import EmailConfirmation from "./EmailConfirmation";
import clsx from "clsx";

const Settings: React.FC = () => {
  return (
    <div
      className={clsx(
        "w-full max-w-landscape mx-auto bg-klerosUIComponentsLightBackground",
        "px-fluid-24-136 pt-fluid-32-80 pb-fluid-76-96"
      )}
    >
      <Routes>
        <Route path="email-confirmation" element={<EmailConfirmation />} />
      </Routes>
    </div>
  );
};

export default Settings;
