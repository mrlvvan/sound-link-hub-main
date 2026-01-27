import { useState } from "react";
import { Settings, Share2, Star, Package, Music, Edit3, Instagram, Twitter, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileServiceCard } from "@/components/profile/ProfileServiceCard";
import { SnippetGridItem } from "@/components/profile/SnippetGridItem";
import { PurchaseItem } from "@/components/profile/PurchaseItem";
import { SettingsDialog } from "@/components/profile/SettingsDialog";
import { Link } from "react-router-dom";
import { useSettingsStore } from "@/stores/settingsStore";

const Profile = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const followStats = [
    { label: "Подписчики", value: "12.5K", change: 24 },
    { label: "Подписки", value: "340", change: -3 },
    { label: "Лайки", value: "8.2K", change: 156 },
  ];

  const stats = [
    { label: "Заказы", value: "23", icon: Package },
    { label: "Рейтинг", value: "4.9", icon: Star },
    { label: "Треки", value: "47", icon: Music },
  ];

  const services = [
    { title: "Создание Trap-битов", price: 15000, views: 1234, ordersCompleted: 12 },
    { title: "Сведение и мастеринг", price: 8000, views: 867, ordersCompleted: 8 },
    { title: "Drill beat production", price: 12000, views: 542, ordersCompleted: 5 },
  ];

  const snippets = [
    { title: "Dark Drill", genre: "Drill", gradient: "bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600" },
    { title: "Neon Nights", genre: "EDM", gradient: "bg-gradient-to-br from-cyan-900 via-cyan-600 to-blue-600" },
    { title: "Lo-Fi Chill", genre: "Lo-Fi", gradient: "bg-gradient-to-br from-green-900 via-green-600 to-teal-600" },
    { title: "Trap Banger", genre: "Trap", gradient: "bg-gradient-to-br from-orange-900 via-red-700 to-pink-600" },
    { title: "Street Energy", genre: "Drill", gradient: "bg-gradient-to-br from-gray-900 via-slate-700 to-purple-900" },
    { title: "Summer Vibes", genre: "Pop", gradient: "bg-gradient-to-br from-pink-900 via-rose-600 to-orange-600" },
  ];

  const purchases = [
    {
      service: "EDM трек production",
      provider: "edm_master",
      date: "5 окт 2025",
      price: 20000,
      status: "completed" as const,
    },
    {
      service: "Вокал под ключ",
      provider: "vocal_pro",
      date: "1 окт 2025",
      price: 12000,
      status: "completed" as const,
    },
    {
      service: "Аранжировка трека",
      provider: "arranger_pro",
      date: "28 сен 2025",
      price: 10000,
      status: "cancelled" as const,
    },
  ];

  const myStudios = [
    { name: "Studio Flow", type: "С аппаратурой", bookings: 34, rating: 4.9 },
    { name: "Репбаза Central", type: "Без аппаратуры", bookings: 18, rating: 4.7 },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary shadow-neon">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              DJ
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold mb-1">DJ ProMax</h1>
            <p className="text-muted-foreground text-sm">Trap-продюсер и звукарь</p>
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
        Профессиональный битмейкер. Специализация: Trap, Drill и Hip-Hop. Более 5 лет опыта.
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

      {/* Social Links */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
          <Instagram className="w-4 h-4 mr-2" />
          Instagram
        </Button>
        <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
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
            <h2 className="text-xl font-semibold mb-4">Мои отрывки</h2>
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
              <Link to="/studios/add">
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
            <h2 className="text-xl font-semibold mb-4">Мои отрывки</h2>
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
              <Link to="/studios/add">
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
                <Link to="/studios/add">
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
    </div>
  );
};

export default Profile;
