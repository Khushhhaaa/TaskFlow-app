import React, { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

const THEME_KEY = "theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button className={styles.toggleBtn} onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle; 