import React from "react";

import DarkModeIcon from "svgs/menu-icons/dark-mode.svg";
import HelpIcon from "svgs/menu-icons/help.svg";
import LightModeIcon from "svgs/menu-icons/light-mode.svg";
// import NotificationsIcon from "svgs/menu-icons/notifications.svg";
import SettingsIcon from "svgs/menu-icons/settings.svg";

import { useTheme } from "hooks/useToggleThemeContext";

import LightButton from "components/LightButton";

import { IHelp, ISettings } from "../index";
import clsx from "clsx";

interface IMenu {
  isMobileNavbar?: boolean;
}

const Menu: React.FC<ISettings & IHelp & IMenu> = ({ toggleIsHelpOpen, toggleIsSettingsOpen, isMobileNavbar }) => {
  const [theme, toggleTheme] = useTheme();
  const isLightTheme = theme === "light";

  const buttons = [
    // { text: "Notifications", Icon: NotificationsIcon },
    {
      text: "Settings",
      Icon: SettingsIcon,
      onPress: () => toggleIsSettingsOpen(),
    },
    {
      text: "Help",
      Icon: HelpIcon,
      onPress: () => {
        toggleIsHelpOpen();
      },
    },
    {
      text: `${isLightTheme ? "Dark" : "Light"} Mode`,
      Icon: isLightTheme ? DarkModeIcon : LightModeIcon,
      onPress: () => toggleTheme(),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      {buttons.map(({ text, Icon, onPress }, index) => (
        <div
          key={index}
          className={clsx("flex items-center min-h-8", "[&_.button-text]:block lg:[&_.button-text]:hidden")}
        >
          <LightButton {...{ text, onPress, Icon, isMobileNavbar }} />
        </div>
      ))}
    </div>
  );
};

export default Menu;
