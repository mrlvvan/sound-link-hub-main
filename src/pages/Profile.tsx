import { useState, useEffect } from "react";
import { Settings, Share2, Star, Package, Music, Edit3, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileServiceCard } from "@/components/profile/ProfileServiceCard";
import { SnippetGridItem } from "@/components/profile/SnippetGridItem";
import { PurchaseItem } from "@/components/profile/PurchaseItem";
import { SettingsDialog } from "@/components/profile/SettingsDialog";
import { Link } from "react-router-dom";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import { AddBeatDialog } from "@/components/beats/AddBeatDialog";
import { supabase } from "@/lib/supabase";

// По 1 примеру — остальное добавляется пользователем
const EXAMPLE_SERVICE = { title: "Создание Trap-битов", price: 15000, views: 0, ordersCompleted: 0 };
const EXAMPLE_PURCHASE = { service: "EDM трек production", provider: "example", date: "—", price: 20000, status: "completed" as const };
const EXAMPLE_STUDIO = { name: "Моя студия", type: "С аппаратурой", bookings: 0, rating: 0 };
const EXAMPLE_SNIPPET = { title: "Мой первый бит", genre: "Trap", gradient: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600" };
const followStats = [{ label: "Подписчики", value: "0", change: 0 }, { label: "Подписки", value: "0", change: 0 }, { label: "Лайки", value: "0", change: 0 }];

const Profile = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { profile, user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addBeatOpen, setAddBeatOpen] = useState(false);
  const [myBeats, setMyBeats] = useState<{ track_name: string; genre: string; cover_gradient: string | null }[]>([]);

  const displayName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "Пользователь";
  const username = profile?.username ? `@${profile.username}` : "";

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const { data } = await supabase.from("beats").select("track_name, genre, cover_gradient").eq("user_id", user.id).order("created_at", { ascending: false });
      setMyBeats(data ?? []);
    };
    load();
  }, [user?.id, addBeatOpen]);

  const snippets = myBeats.length > 0
    ? myBeats.map((b) => ({ title: b.track_name, genre: b.genre, gradient: b.cover_gradient || EXAMPLE_SNIPPET.gradient }))
    : [EXAMPLE_SNIPPET];

  const services = [EXAMPLE_SERVICE];
  const purchases = [EXAMPLE_PURCHASE];
  const myStudios = [EXAMPLE_STUDIO];
  const stats = [
    { label: "Заказы", value: "0", icon: Package },
    { label: "Рейтинг", value: "—", icon: Star },
    { label: "Треки", value: String(myBeats.length), icon: Music },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary shadow-neon">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
            <p className="text-muted-foreground text-sm">{username || user?.email || "Ваш профиль"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm mb-3 text-muted-foreground">
        {profile?.bio || "Добавьте описание в настройках профиля."}
      </p>

      {/* Follow Stats - compact with dividers like in UserProfileCard */}
      <div className="grid grid-cols-3 gap-1 py-3 border-y border-border mb-3">
        {followStats.map((stat, index) => (
          <button key={index} className="text-center hover:bg-muted/50 rounded-lg p-2 transition-colors">
            <div className="flex items-center justify-center gap-1">
              <span className="text-base md:text-xl font-bold">{stat.value}</span>
              {stat.change !== 0 && (
                <span className={`text-[10px] font-medium ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative bg-card border border-border rounded-xl p-4 text-center overflow-hidden"
          >
            <stat.icon className="absolute top-2 right-2 w-8 h-8 text-primary/10" strokeWidth={1.5} />
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <Button className="flex-1 bg-gradient-primary hover:shadow-neon">
          Редактировать
        </Button>
        <Link to="/studio" className="flex-1">
          <Button className="w-full bg-gradient-accent hover:shadow-accent">
            <Edit3 className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Студия
          </Button>
        </Link>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="all">Всё</TabsTrigger>
          <TabsTrigger value="provider">Автор</TabsTrigger>
          <TabsTrigger value="studios">Студии</TabsTrigger>
          <TabsTrigger value="client">Клиент</TabsTrigger>
        </TabsList>

        {/* All Content */}
        <TabsContent value="all" className="space-y-6">
          {/* Snippets */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Мои отрывки</h2>
              <Button size="sm" onClick={() => setAddBeatOpen(true)} className="bg-gradient-primary hover:shadow-neon">
                <Plus className="w-4 h-4 mr-1.5" />
                Добавить бит
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {snippets.map((snippet, index) => (
                <SnippetGridItem key={index} {...snippet} />
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Мои услуги</h2>
            <div className="space-y-3">
              {services.map((service, index) => (
                <ProfileServiceCard key={index} {...service} />
              ))}
            </div>
          </section>

          {/* Studios */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Мои студии</h2>
              <Link to="/add-studio">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
                  Добавить
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {myStudios.map((studio, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                      <Building2 className="w-4 h-4 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{studio.name}</h3>
                      <p className="text-xs text-muted-foreground">{studio.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" strokeWidth={1.5} />
                      <span className="font-medium">{studio.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{studio.bookings} бронирований</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Purchases */}
          <section>
            <h2 className="text-xl font-semibold mb-4">История покупок</h2>
            <div className="space-y-3">
              {purchases.map((purchase, index) => (
                <PurchaseItem key={index} {...purchase} />
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Provider Content */}
        <TabsContent value="provider" className="space-y-6">
          {/* Snippets */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Мои отрывки</h2>
              <Button size="sm" onClick={() => setAddBeatOpen(true)} className="gap-1.5">
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                Добавить бит
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
              {snippets.map((snippet, index) => (
                <SnippetGridItem key={index} {...snippet} />
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Мои услуги</h2>
            <div className="space-y-3">
              {services.map((service, index) => (
                <ProfileServiceCard key={index} {...service} />
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Studios Content */}
        <TabsContent value="studios" className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Мои студии</h2>
              <Link to="/add-studio">
                <Button size="sm" className="bg-gradient-primary hover:shadow-neon">
                  <Plus className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
                  Добавить студию
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {myStudios.map((studio, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                      <Building2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{studio.name}</h3>
                      <p className="text-sm text-muted-foreground">{studio.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary fill-primary" strokeWidth={1.5} />
                      <span className="font-medium">{studio.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="w-4 h-4" strokeWidth={1.5} />
                      <span>{studio.bookings} бронирований</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Редактировать
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Статистика
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {myStudios.length === 0 && (
              <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
                <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-muted-foreground mb-4">У вас пока нет студий</p>
                <Link to="/add-studio">
                  <Button className="bg-gradient-primary hover:shadow-neon">
                    <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Добавить первую студию
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </TabsContent>

        {/* Client Content */}
        <TabsContent value="client" className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">История покупок</h2>
            <div className="space-y-3">
              {purchases.map((purchase, index) => (
                <PurchaseItem key={index} {...purchase} />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AddBeatDialog open={addBeatOpen} onOpenChange={setAddBeatOpen} />
    </div>
  );
};

export default Profile;
