import { useEffect } from "react";

/**
 * Hook to initialize dark mode on app load
 * This ensures dark mode persists across page refreshes
 */
export const useDarkMode = () => {
  useEffect(() => {
    const darkMode = localStorage.getItem("geo-smart-dark-mode");
    const isDark = darkMode ? JSON.parse(darkMode) : false;
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
};
