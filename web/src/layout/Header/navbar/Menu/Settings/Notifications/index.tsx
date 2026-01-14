import React from "react";
import { ISettings } from "../../../index";

import FormContactDetails from "./FormContactDetails";
import { EnsureChain } from "components/EnsureChain";
import { EnsureAuth } from "components/EnsureAuth";

const HeaderNotifs: React.FC = () => {
  return (
    <div className="flex justify-center mt-4 mb-3 text-base font-semibold text-klerosUIComponentsPrimaryText">
      Contact Details
    </div>
  );
};

const NotificationSettings: React.FC<ISettings> = ({ toggleIsSettingsOpen }) => {
  return (
    <div className="flex justify-center py-4">
      <EnsureChain>
        <div className="flex flex-col w-full h-full items-center">
          <EnsureAuth>
            <>
              <HeaderNotifs />
              <FormContactDetails toggleIsSettingsOpen={toggleIsSettingsOpen} />
            </>
          </EnsureAuth>
        </div>
      </EnsureChain>
    </div>
  );
};

export default NotificationSettings;
