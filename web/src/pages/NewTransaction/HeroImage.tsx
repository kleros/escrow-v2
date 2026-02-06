import React from "react";
import { useTheme } from "src/hooks/useToggleThemeContext";
import { useWindowSize } from "react-use";
import HeroLightMobile from "svgs/hero/hero-lightmode-mobile.svg";
import HeroDarkMobile from "svgs/hero/hero-darkmode-mobile.svg";
import HeroLightDesktop from "svgs/hero/hero-lightmode-desktop.svg";
import HeroDarkDesktop from "svgs/hero/hero-darkmode-desktop.svg";
import { LG_BREAKPOINT } from "src/styles/breakpoints";

const HeroImage = () => {
  const { width } = useWindowSize();
  const [theme] = useTheme();
  const themeIsLight = theme === "light";
  const screenIsBig = width > LG_BREAKPOINT;
  return <div>{screenIsBig ? <HeroDesktop {...{ themeIsLight }} /> : <HeroMobile {...{ themeIsLight }} />}</div>;
};

const HeroDesktop: React.FC<{ themeIsLight: boolean }> = ({ themeIsLight }) => {
  return themeIsLight ? <HeroLightDesktop /> : <HeroDarkDesktop />;
};

const HeroMobile: React.FC<{ themeIsLight: boolean }> = ({ themeIsLight }) => {
  return themeIsLight ? <HeroLightMobile /> : <HeroDarkMobile />;
};

export default HeroImage;
