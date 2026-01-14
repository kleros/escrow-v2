import React, { useEffect } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ToggleThemeProvider } from "hooks/useToggleThemeContext";

type Theme = "light" | "dark";

const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "dark");

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <ToggleThemeProvider {...{ theme, toggleTheme }}>{children}</ToggleThemeProvider>;
};

export default ThemeProvider;
