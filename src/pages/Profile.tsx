import { useEffect, useState } from "react";
import {
  Settings, Share2, Music, Plus, Briefcase, Package, Trash2, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SettingsDialog } from "@/components/profile/SettingsDialog";
import { AddBeatDialog } from "@/components/beats/AddBeatDialog";
import { AddServiceDialog } from "@/components/marketplace/AddServiceDialog";
import { AddProductDialog } from "@/components/marketplace/AddProductDialog";
import { SnippetGridItem } from "@/components/profile/SnippetGridItem";
import { Link } from "react-router-dom";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTrackFeedPath,
  getTracksByUserId,
  deleteBeat,
  getFollowCounts,
  type TrackCard,
} from "@/lib/music";
import { getStudios, type StudioRecord } from "@/lib/bookings";
import {
  getServicesByUserId,
  getProductsByUserId,
  deleteService,
  deleteProduct,
  getCategoryLabel,
  getProductTypeLabel,
  type ServiceRecord,
  type ProductRecord,
} from "@/lib/marketplace";
import { toast } from "sonner";

const Profile = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { profile, user } = useAuth();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addBeatOpen, setAddBeatOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);

  const [beats, setBeats] = useState<TrackCard[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [myStudios, setMyStudios] = useState<StudioRecord[]>([]);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  const displayName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "Пользователь";
  const username = profile?.username ? `@${profile.username}` : "";

  const loadAll = async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const [b, s, p, fc, st] = await Promise.all([
        getTracksByUserId(user.id),
        getServicesByUserId(user.id),
        getProductsByUserId(user.id),
        getFollowCounts(user.id),
        getStudios({ ownerId: user.id }),
      ]);
      setBeats(b);
      setServices(s);
      setProducts(p);
      setFollowCounts(fc);
      setMyStudios(st);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAll(); }, [user?.id]);

  const handleDeleteBeat = async (beatId: string) => {
    try {
      await deleteBeat(beatId);
      setBeats((prev) => prev.filter((b) => b.id !== beatId));
      toast.success("Бит удалён");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Услуга удалена");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Товар удалён");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleShare = () => {
    if (profile?.username) {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.username}`);
      toast.success("Ссылка скопирована");
    }
  };

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-2xl mx-auto"
      style={{ paddingTop: isFullscreen ? `calc(1.5rem + ${safeAreaTopInset}px)` : "1.5rem" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary shadow-neon">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground text-sm">{username || user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <p className="text-sm mb-4 text-muted-foreground">{profile.bio}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1 py-3 border-y border-border mb-5 text-center">
        {[
          { label: "Подписчики", value: followCounts.followers },
          { label: "Подписки", value: followCounts.following },
          { label: "Биты", value: beats.length },
          { label: "Услуги", value: services.length + products.length },
        ].map((s) => (
          <div key={s.label} className="py-1">
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit button */}
      <Button
        className="w-full mb-6"
        variant="outline"
        onClick={() => setSettingsOpen(true)}
      >
        Редактировать профиль
      </Button>

      {/* Tabs */}
      <Tabs defaultValue="beats">
        <TabsList className="w-full flex overflow-x-auto gap-1 mb-5 h-auto p-1 scrollbar-hide">
          <TabsTrigger value="beats" className="gap-1.5 flex-shrink-0">
            <Music className="w-4 h-4" />
            Биты
            {beats.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{beats.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5 flex-shrink-0">
            <Briefcase className="w-4 h-4" />
            Услуги
            {services.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{services.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5 flex-shrink-0">
            <Package className="w-4 h-4" />
            Товары
            {products.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{products.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="studios" className="gap-1.5 flex-shrink-0">
            <Building2 className="w-4 h-4" />
            Студии
            {myStudios.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{myStudios.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* ── Биты ── */}
        <TabsContent value="beats" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Мои биты</h2>
            <Button size="sm" onClick={() => setAddBeatOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Загрузить
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : beats.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {beats.map((track) => (
                <div key={track.id} className="relative group">
                  <SnippetGridItem
                    title={track.trackName}
                    genre={track.genre}
                    gradient={track.gradientBg}
                    to={getTrackFeedPath(track.id)}
                  />
                  <button
                    onClick={() => void handleDeleteBeat(track.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1 text-white hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {track.servicePrice != null && track.servicePrice > 0 && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                        ₽{track.servicePrice.toLocaleString("ru-RU")}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Music className="w-10 h-10 text-muted-foreground/40" />}
              title="Нет битов"
              description="Загрузите первый бит — он появится в ленте и вашем профиле"
              action={
                <Button size="sm" onClick={() => setAddBeatOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Загрузить бит
                </Button>
              }
            />
          )}
        </TabsContent>

        {/* ── Услуги ── */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Мои услуги</h2>
            <Button size="sm" onClick={() => setAddServiceOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : services.length > 0 ? (
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{s.title}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                        {getCategoryLabel(s.category)}
                      </Badge>
                    </div>
                    {s.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                    )}
                    <p className="text-primary font-bold text-sm mt-1.5">
                      от ₽{s.price.toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <button
                    onClick={() => void handleDeleteService(s.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Briefcase className="w-10 h-10 text-muted-foreground/40" />}
              title="Нет услуг"
              description="Добавьте услуги — сведение, мастеринг, запись или продюсирование"
              action={
                <Button size="sm" onClick={() => setAddServiceOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить услугу
                </Button>
              }
            />
          )}
        </TabsContent>

        {/* ── Товары ── */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Мои товары</h2>
            <Button size="sm" onClick={() => setAddProductOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{p.title}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                        {getProductTypeLabel(p.product_type)}
                      </Badge>
                    </div>
                    {p.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    )}
                    <p className="text-primary font-bold text-sm mt-1.5">
                      ₽{p.price.toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <button
                    onClick={() => void handleDeleteProduct(p.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Package className="w-10 h-10 text-muted-foreground/40" />}
              title="Нет товаров"
              description="Продавайте биты, сэмпл паки, пресеты и другие цифровые товары"
              action={
                <Button size="sm" onClick={() => setAddProductOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить товар
                </Button>
              }
            />
          )}
        </TabsContent>

        {/* ── Студии ── */}
        <TabsContent value="studios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Мои студии</h2>
            <Link to="/add-studio">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : myStudios.length > 0 ? (
            <div className="space-y-3">
              {myStudios.map((s) => (
                <Link
                  key={s.id}
                  to={`/studios/${s.id}`}
                  className="flex items-start justify-between gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.city}, {s.address}</p>
                    {s.equipment && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.equipment}</p>
                    )}
                  </div>
                  <p className="text-primary font-bold text-sm flex-shrink-0">
                    ₽{s.price_per_hour.toLocaleString("ru-RU")}/ч
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Building2 className="w-10 h-10 text-muted-foreground/40" />}
              title="Нет студий"
              description="Добавьте свою студию для аренды — другие пользователи смогут её забронировать"
              action={
                <Link to="/add-studio">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить студию
                  </Button>
                </Link>
              }
            />
          )}
        </TabsContent>
      </Tabs>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AddBeatDialog open={addBeatOpen} onOpenChange={setAddBeatOpen} onSuccess={() => void loadAll()} />
      <AddServiceDialog open={addServiceOpen} onOpenChange={setAddServiceOpen} onSuccess={() => void loadAll()} />
      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} onSuccess={() => void loadAll()} />
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-dashed border-border p-8 text-center flex flex-col items-center gap-3">
    {icon}
    <div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    {action}
  </div>
);

export default Profile;
