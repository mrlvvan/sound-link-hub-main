import { Home, Search, Package, Mic2, User, PlayCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: PlayCircle, label: "Feed", path: "/feed" },
  { icon: Search, label: "Поиск", path: "/search" },
  { icon: Package, label: "Заказы", path: "/orders" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export const SidebarNav = () => {
  const { profile, user } = useAuth();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card/95 backdrop-blur-lg border-r border-border z-40 flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          SoundLinker
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Слушай. Создавай. Работай.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform flex-shrink-0",
                    isActive ? "scale-110" : "group-hover:scale-105"
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/50">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs bg-primary/20">
                {String(profile?.display_name || profile?.username || user?.email || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{profile?.display_name || profile?.username || "Вы"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{profile?.username ? `@${profile.username}` : user?.email}</p>
            </div>
          </div>
        )}
        <div className="text-xs text-muted-foreground text-center">
          © 2025 SoundLinker
        </div>
      </div>
    </aside>
  );
};
