import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full transition-smooth hover:bg-accent"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 transition-smooth" />
      ) : (
        <Moon className="h-4.5 w-4.5 transition-smooth" />
      )}
    </Button>
  );
}