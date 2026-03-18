import { Home, Search, Package, Mic2, User, PlayCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: PlayCircle, label: "Feed", path: "/feed" },
  { icon: Search, label: "Поиск", path: "/search" },
  { icon: Package, label: "Заказы", path: "/orders" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="max-w-lg mx-auto px-1 pb-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all min-w-0 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 transition-transform flex-shrink-0 ${
                      isActive ? "scale-110" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] font-medium truncate max-w-[60px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <ThemeToggle variant="compact" />
        </div>
      </div>
    </nav>
  );
};
