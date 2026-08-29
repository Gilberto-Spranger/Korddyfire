"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon } from "@/components/sunIcon";
import { MoonIcon } from "@/components/moonIcon";
import clsx from "clsx";

const ButtonTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "w-14 h-8 rounded-full p-1 flex items-center relative transition-colors duration-300 cursor-pointer border border-gray-300",
        isDark ? "bg-green-500" : "bg-gray-900"
      )}
    >
      <div
        className={clsx(
          "absolute left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300",
          isDark ? "translate-x-6" : "translate-x-0"
        )}
      >
        {isDark ? (
          <MoonIcon className="w-4 h-4 text-gray-800" />
        ) : (
          <SunIcon className="w-4 h-4 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ButtonTheme;

