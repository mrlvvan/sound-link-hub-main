import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { MessageSquare, UserPlus, UserCheck, Share2, Music, Briefcase, Package, Building2 } from "lucide-react";
import { BuyConfirmDialog } from "@/components/orders/BuyConfirmDialog";
import type { OrderItemType } from "@/lib/orders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SnippetGridItem } from "@/components/profile/SnippetGridItem";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPublicProfileByUsername,
  getTrackFeedPath,
  getTracksByUserId,
  getFollowStatus,
  toggleFollow,
  getFollowCounts,
  type ProfileRecord,
  type TrackCard,
} from "@/lib/music";
import {
  getServicesByUserId,
  getProductsByUserId,
  getCategoryLabel,
  getProductTypeLabel,
  type ServiceRecord,
  type ProductRecord,
} from "@/lib/marketplace";
import { getStudios, type StudioRecord } from "@/lib/bookings";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { profile: currentProfile, user } = useAuth();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState<ProfileRecord | null>(null);
  const [tracks, setTracks] = useState<TrackCard[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [studios, setStudios] = useState<StudioRecord[]>([]);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buyItem, setBuyItem] = useState<{
    id: string; type: OrderItemType; title: string; price: number;
    sellerId: string; sellerUsername: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!username) { setLoading(false); return; }
      setLoading(true);
      try {
        const nextProfile = await getPublicProfileByUsername(username);
        setUserProfile(nextProfile);
        if (!nextProfile) return;

        const [t, s, p, fc, st] = await Promise.all([
          getTracksByUserId(nextProfile.id),
          getServicesByUserId(nextProfile.id),
          getProductsByUserId(nextProfile.id),
          getFollowCounts(nextProfile.id),
          getStudios({ ownerId: nextProfile.id }),
        ]);
        setTracks(t);
        setServices(s);
        setProducts(p);
        setFollowCounts(fc);
        setStudios(st);

        if (user) {
          const following = await getFollowStatus(user.id, nextProfile.id);
          setIsFollowing(following);
        }
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [username, user]);

  if (username && currentProfile?.username === username) {
    return <Navigate to="/profile" replace />;
  }

  const handleFollow = async () => {
    if (!user) { navigate("/login"); return; }
    if (!userProfile) return;
    const prev = isFollowing;
    setIsFollowing(!prev);
    setFollowCounts((c) => ({ ...c, followers: c.followers + (prev ? -1 : 1) }));
    try {
      await toggleFollow(user.id, userProfile.id, prev);
    } catch {
      setIsFollowing(prev);
      setFollowCounts((c) => ({ ...c, followers: c.followers + (prev ? 1 : -1) }));
      toast.error("Ошибка");
    }
  };

  const handleMessage = () => {
    if (!user) { navigate("/login"); return; }
    if (userProfile) navigate(`/messages/${userProfile.id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Ссылка скопирована");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">@{username}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Пользователь не найден</h1>
          <p className="text-muted-foreground">@{username}</p>
        </div>
      </div>
    );
  }

  const displayName = userProfile.display_name || userProfile.username;

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 max-w-2xl mx-auto px-4"
      style={{ paddingTop: isFullscreen ? `${safeAreaTopInset}px` : "1.5rem" }}
    >
      {/* Avatar + info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-primary">
            <AvatarImage src={userProfile.avatar_url ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-2xl font-bold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground text-sm">@{userProfile.username}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Bio */}
      {userProfile.bio && (
        <p className="text-sm text-muted-foreground mb-4">{userProfile.bio}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1 py-3 border-y border-border mb-4 text-center">
        {[
          { label: "Подписчики", value: followCounts.followers },
          { label: "Подписки", value: followCounts.following },
          { label: "Биты", value: tracks.length },
          { label: "Услуги", value: services.length + products.length },
        ].map((s) => (
          <div key={s.label} className="py-1">
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          className="flex-1"
          variant={isFollowing ? "outline" : "default"}
          onClick={() => void handleFollow()}
        >
          {isFollowing ? (
            <><UserCheck className="w-4 h-4 mr-2" />Подписан</>
          ) : (
            <><UserPlus className="w-4 h-4 mr-2" />Подписаться</>
          )}
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleMessage}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Написать
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="beats">
        <TabsList className="w-full flex overflow-x-auto gap-1 mb-4 h-auto p-1 scrollbar-hide">
          <TabsTrigger value="beats" className="gap-1.5 text-xs flex-shrink-0">
            <Music className="w-3.5 h-3.5" />
            Биты
            {tracks.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{tracks.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5 text-xs flex-shrink-0">
            <Briefcase className="w-3.5 h-3.5" />
            Услуги
            {services.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{services.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5 text-xs flex-shrink-0">
            <Package className="w-3.5 h-3.5" />
            Товары
            {products.length > 0 && <Badge variant="secondary" className="h-4 text-[10px] px-1">{products.length}</Badge>}
          </TabsTrigger>
          {studios.length > 0 && (
            <TabsTrigger value="studios" className="gap-1.5 text-xs flex-shrink-0">
              <Building2 className="w-3.5 h-3.5" />
              Студии
              <Badge variant="secondary" className="h-4 text-[10px] px-1">{studios.length}</Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="beats">
          {tracks.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {tracks.map((track) => (
                <div key={track.id} className="relative">
                  <SnippetGridItem
                    title={track.trackName}
                    genre={track.genre}
                    gradient={track.gradientBg}
                    to={getTrackFeedPath(track.id)}
                  />
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
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Биты пока не опубликованы
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-3">
          {services.length > 0 ? (
            services.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
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
                  <Button size="sm" variant="outline" onClick={() =>
                    setBuyItem({ id: s.id, type: "service", title: s.title, price: s.price, sellerId: userProfile.id, sellerUsername: userProfile.username })
                  }>
                    Заказать
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Услуги пока не опубликованы
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-3">
          {products.length > 0 ? (
            products.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
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
                  <Button size="sm" variant="outline" onClick={() =>
                    setBuyItem({ id: p.id, type: "product", title: p.title, price: p.price, sellerId: userProfile.id, sellerUsername: userProfile.username })
                  }>
                    Купить
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Товары пока не добавлены
            </div>
          )}
        </TabsContent>

        {studios.length > 0 && (
          <TabsContent value="studios" className="space-y-3">
            {studios.map((s) => (
              <Link key={s.id} to={`/studios/${s.id}`}
                className="flex items-start justify-between gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.city}, {s.address}</p>
                  {s.equipment && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.equipment}</p>}
                </div>
                <p className="text-primary font-bold text-sm flex-shrink-0">
                  ₽{s.price_per_hour.toLocaleString("ru-RU")}/ч
                </p>
              </Link>
            ))}
          </TabsContent>
        )}
      </Tabs>
      {buyItem && (
        <BuyConfirmDialog
          open={Boolean(buyItem)}
          onOpenChange={(open) => !open && setBuyItem(null)}
          item={buyItem}
        />
      )}
    </div>
  );
};

export default UserProfile;
