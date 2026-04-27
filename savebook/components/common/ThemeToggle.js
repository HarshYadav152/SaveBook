"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { mounted, theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-button ${className}`.trim()}
      aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mounted && theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {mounted && theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
