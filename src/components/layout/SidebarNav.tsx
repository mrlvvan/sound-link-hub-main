import { Home, Search, Package, User, PlayCircle, Shield, MessageSquare, Mic2, Building2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";
import { NotificationsSheet } from "@/components/notifications/NotificationsSheet";
import { useNotifications } from "@/hooks/useNotifications";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: PlayCircle, label: "Feed", path: "/feed" },
  { icon: Search, label: "Поиск", path: "/search" },
  { icon: MessageSquare, label: "Сообщения", path: "/messages", badge: "messages" as const },
  { icon: Mic2, label: "Студия", path: "/studio" },
  { icon: Building2, label: "Студии", path: "/studios" },
  { icon: Package, label: "Заказы", path: "/orders", badge: "orders" as const },
  { icon: User, label: "Профиль", path: "/profile" },
];

export const SidebarNav = () => {
  const { profile, user, isAdmin } = useAuth();
  const { messages, orders } = useUnreadCounts();
  const { unreadCount: notifCount } = useNotifications();

  const badgeCount = (key?: "messages" | "orders") => {
    if (key === "messages") return messages;
    if (key === "orders") return orders;
    return 0;
  };

  const items = [
    ...navItems,
    ...(isAdmin ? [{ icon: Shield, label: "Админ", path: "/admin" }] : []),
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card/95 backdrop-blur-lg border-r border-border z-40 flex-col">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            SoundLinker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Слушай. Создавай. Работай.</p>
        </div>
        {user && (
          <NotificationsSheet side="right">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </button>
          </NotificationsSheet>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const count = badgeCount((item as typeof navItems[0]).badge);
          return (
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
                  <div className="relative flex-shrink-0">
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-transform",
                        isActive ? "scale-110" : "group-hover:scale-105"
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

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
              <p className="text-[10px] text-muted-foreground truncate">
                {profile?.username ? `@${profile.username}` : user?.email}
              </p>
            </div>
          </div>
        )}
        <div className="text-xs text-muted-foreground text-center">© 2025 SoundLinker</div>
      </div>
    </aside>
  );
};
