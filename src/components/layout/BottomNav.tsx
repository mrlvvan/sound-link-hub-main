import { Home, Search, PlayCircle, MessageSquare, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";
import { NotificationsSheet } from "@/components/notifications/NotificationsSheet";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: PlayCircle, label: "Feed", path: "/feed" },
  { icon: Search, label: "Поиск", path: "/search" },
  { icon: MessageSquare, label: "Чат", path: "/messages", badge: "messages" as const },
  { icon: User, label: "Профиль", path: "/profile" },
];

export const BottomNav = () => {
  const { messages } = useUnreadCounts();
  const { user } = useAuth();
  const { unreadCount: notifCount } = useNotifications();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="max-w-lg mx-auto px-1 pb-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const count = item.badge === "messages" ? messages : 0;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all min-w-0 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <item.icon
                        className={`w-5 h-5 transition-transform flex-shrink-0 ${isActive ? "scale-110" : ""}`}
                        strokeWidth={1.5}
                      />
                      {count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium truncate max-w-[60px]">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          {user ? (
            <NotificationsSheet side="left">
              <button className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all min-w-0 text-muted-foreground hover:text-foreground relative">
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {notifCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                      {notifCount > 99 ? "99+" : notifCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">Оповещения</span>
              </button>
            </NotificationsSheet>
          ) : (
            <ThemeToggle variant="compact" />
          )}
        </div>
      </div>
    </nav>
  );
};
