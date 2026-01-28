import { useState, useEffect } from "react";

type ColorMode = "light" | "dark";

const useColorMode = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    // Load the initial color mode from localStorage or system preference
    const storedColorMode = localStorage.getItem(
      "color-mode"
    ) as ColorMode | null;
    if (storedColorMode) {
      setColorMode(storedColorMode);
    } else {
      // Fallback to system preference if no mode is set
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Apply the color mode to the document's root
    document.documentElement.setAttribute("data-theme", colorMode);

    // Save the color mode to localStorage
    localStorage.setItem("color-mode", colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return { colorMode, setColorMode, toggleColorMode };
};

export default useColorMode;
