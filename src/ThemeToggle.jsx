import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "conjumate-theme";

function savedTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const preference = useRef(savedTheme());
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return (
      document.documentElement.dataset.theme ||
      savedTheme() ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#101719" : "#ffffff");
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event) => {
      if (!preference.current) setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    preference.current = next;
    setTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The toggle also works in file previews or browsers that block storage.
    }
  }

  return (
    <button
      className="theme-toggle icon-button"
      type="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <Moon size={20} aria-hidden="true" />
      ) : (
        <Sun size={20} aria-hidden="true" />
      )}
    </button>
  );
}
