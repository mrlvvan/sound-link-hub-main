import { Sun, Moon } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEffectiveTheme } from "@/contexts/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "compact";
  className?: string;
}

export const ThemeToggle = ({ variant = "icon", className }: ThemeToggleProps) => {
  const effective = useEffectiveTheme();
  const setTheme = useSettingsStore((s) => s.setTheme);

  const handleClick = () => {
    const next = effective === "dark" ? "light" : "dark";
    setTheme(next);
  };

  const label = effective === "dark" ? "Светлая" : "Тёмная";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Тема: ${label}`}
        className={cn(
          "flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all min-w-0 text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {effective === "dark" ? (
          <Sun className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
        ) : (
          <Moon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
        )}
        <span className="text-[10px] font-medium truncate max-w-[60px]">Тема</span>
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9", className)}
          onClick={handleClick}
          aria-label={`Тема: ${label}`}
        >
          {effective === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {effective === "dark" ? "Светлая тема" : "Тёмная тема"}
      </TooltipContent>
    </Tooltip>
  );
};
