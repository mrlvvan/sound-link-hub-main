import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const apply = (isDark: boolean) => {
      document.documentElement.classList.toggle("dark", isDark);
    };

    const isDark =
      theme === "dark"
        ? true
        : theme === "light"
          ? false
          : window.matchMedia("(prefers-color-scheme: dark)").matches;
    apply(isDark);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply(mq.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  return <>{children}</>;
};

export function useEffectiveTheme(): "light" | "dark" {
  const theme = useSettingsStore((s) => s.theme);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
  );

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemDark(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return systemDark ? "dark" : "light";
}
