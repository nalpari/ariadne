"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shell/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button variant="secondary" className="h-9 w-9 px-0" aria-label="Toggle theme" onClick={toggleTheme}>
      <Icon aria-hidden="true" size={16} />
    </Button>
  );
}
