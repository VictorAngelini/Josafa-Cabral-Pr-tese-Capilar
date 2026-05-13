import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className="w-9 h-9 rounded-full flex items-center justify-center border border-border bg-background hover:bg-muted transition-colors shrink-0"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-secondary" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      )}
    </button>
  );
}
