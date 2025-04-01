
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 rounded-full transition-all duration-300 hover:rotate-12 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
