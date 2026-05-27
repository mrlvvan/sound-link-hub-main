import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Users, Music, ShoppingBag, Building2, MessageSquare, RefreshCcw, Briefcase, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Stats = {
  users: number;
  beats: number;
  orders: number;
  studios: number;
  messages: number;
  services: number;
  products: number;
};

type RecentUser = {
  id: string;
  username: string;
  display_name: string | null;
  created_at: string;
};

const StatCard = ({ icon: Icon, label, value, gradient }: { icon: React.ElementType; label: string; value: number | null; gradient: string }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg ${gradient} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="text-3xl font-bold">{value === null ? "—" : value.toLocaleString("ru-RU")}</p>
  </div>
);

const Admin = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [
        { count: users },
        { count: beats },
        { count: orders },
        { count: studios },
        { count: messages },
        { count: services },
        { count: products },
        { data: recent },
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("beats").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("studios").select("id", { count: "exact", head: true }),
        supabase.from("direct_messages").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id, username, display_name, created_at")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      setStats({
        users: users ?? 0,
        beats: beats ?? 0,
        orders: orders ?? 0,
        studios: studios ?? 0,
        messages: messages ?? 0,
        services: services ?? 0,
        products: products ?? 0,
      });
      setRecentUsers((recent as RecentUser[]) ?? []);
    } catch {
      toast.error("Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 max-w-4xl mx-auto px-4 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Админ-панель</h1>
            <p className="text-muted-foreground text-sm">
              {profile?.display_name || profile?.username}, администратор
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => void load()} disabled={loading}>
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Пользователи" value={stats.users} gradient="bg-gradient-primary" />
          <StatCard icon={Music} label="Биты" value={stats.beats} gradient="bg-gradient-accent" />
          <StatCard icon={ShoppingBag} label="Заказы" value={stats.orders} gradient="bg-gradient-to-br from-green-500 to-teal-500" />
          <StatCard icon={Building2} label="Студии" value={stats.studios} gradient="bg-gradient-to-br from-violet-600 to-indigo-600" />
          <StatCard icon={MessageSquare} label="Сообщения" value={stats.messages} gradient="bg-gradient-to-br from-cyan-500 to-blue-500" />
          <StatCard icon={Briefcase} label="Услуги" value={stats.services} gradient="bg-gradient-to-br from-orange-500 to-red-500" />
          <StatCard icon={Package} label="Товары" value={stats.products} gradient="bg-gradient-to-br from-pink-500 to-purple-500" />
        </div>
      ) : null}

      {/* Recent users */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Новые пользователи
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : recentUsers.length > 0 ? (
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <span className="font-medium text-sm">{u.display_name || u.username}</span>
                  <span className="text-muted-foreground text-xs ml-2">@{u.username}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Пользователей пока нет</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
