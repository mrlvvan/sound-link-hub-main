import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Calendar, Building2, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import { getStudioById, createBooking, type StudioRecord } from "@/lib/bookings";
import { getStudioReviews, getStudioRating, type ReviewRecord } from "@/lib/reviews";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const StarRating = ({ value, max = 5, size = "sm" }: { value: number; max?: number; size?: "sm" | "md" }) => {
  const sz = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${i < Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
};

const StudioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studio, setStudio] = useState<StudioRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [rating, setRating] = useState({ avg: 0, count: 0 });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [s, rv, rt] = await Promise.all([
          getStudioById(id),
          getStudioReviews(id),
          getStudioRating(id),
        ]);
        setStudio(s);
        setReviews(rv);
        setRating(rt);
      } catch {
        toast.error("Не удалось загрузить студию");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleBook = async () => {
    if (!user) { navigate("/login"); return; }
    if (!studio) return;
    if (user.id === studio.owner_id) { toast.error("Это ваша студия"); return; }

    setBooking(true);
    try {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      const b = await createBooking({
        studioId: studio.id,
        renterId: user.id,
        ownerId: studio.owner_id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalPrice: studio.price_per_hour * 2,
      });
      toast.success("Запрос отправлен!");
      navigate(`/bookings/${b.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при бронировании");
    } finally {
      setBooking(false);
    }
  };

  const openMap = () => {
    if (!studio) return;
    const q = encodeURIComponent(`${studio.city} ${studio.address}`);
    window.open(`https://yandex.ru/maps/?text=${q}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">Загрузка студии...</p>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="font-semibold">Студия не найдена</p>
        <Button variant="outline" onClick={() => navigate("/studios")}>К студиям</Button>
      </div>
    );
  }

  const ownerName = studio.owner?.display_name || studio.owner?.username || "Владелец";
  const desc = studio.description ?? "";
  const isOwner = user?.id === studio.owner_id;

  return (
    <div
      className="min-h-screen pb-32 bg-background"
      style={{ paddingTop: isFullscreen ? `${safeAreaTopInset}px` : "0" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link to="/studios">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="ml-3 font-semibold text-lg truncate">{studio.name}</h1>
          {rating.count > 0 && (
            <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{rating.avg}</span>
              <span className="text-xs text-muted-foreground">({rating.count})</span>
            </div>
          )}
        </div>
      </div>

      {/* Photo or gradient */}
      {studio.photos.length > 0 ? (
        <div className="h-56 overflow-hidden">
          <img src={studio.photos[0]} alt={studio.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-56 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <Building2 className="w-20 h-20 text-white/30" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-2xl font-bold">{studio.name}</h2>
            {isOwner && (
              <Badge variant="outline" className="text-xs flex-shrink-0">Ваша студия</Badge>
            )}
          </div>

          {rating.count > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating value={rating.avg} size="sm" />
              <span className="text-sm font-semibold">{rating.avg}</span>
              <span className="text-xs text-muted-foreground">{rating.count} {rating.count === 1 ? "отзыв" : rating.count < 5 ? "отзыва" : "отзывов"}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
            <button onClick={openMap} className="hover:text-primary hover:underline transition-colors text-left">
              {studio.city}, {studio.address}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Mic2 className="w-3 h-3 mr-1" />
              С аппаратурой
            </Badge>
            {studio.price_per_hour > 0 && (
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                Почасовая
              </Badge>
            )}
            {studio.price_per_day && (
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                Посуточная
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Цены</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/30 border border-border p-4 text-center">
              <p className="text-2xl font-bold text-primary">₽{studio.price_per_hour.toLocaleString("ru-RU")}</p>
              <p className="text-sm text-muted-foreground">за час</p>
            </div>
            {studio.price_per_day && (
              <div className="rounded-xl bg-muted/30 border border-border p-4 text-center">
                <p className="text-2xl font-bold text-primary">₽{studio.price_per_day.toLocaleString("ru-RU")}</p>
                <p className="text-sm text-muted-foreground">за день</p>
              </div>
            )}
          </div>
        </div>

        {desc && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3">Описание</h3>
              <p className={`text-muted-foreground leading-relaxed ${!showFullDesc && desc.length > 200 ? "line-clamp-4" : ""}`}>
                {desc}
              </p>
              {desc.length > 200 && (
                <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setShowFullDesc(!showFullDesc)}>
                  {showFullDesc ? "Скрыть" : "Показать полностью"}
                </Button>
              )}
            </div>
          </>
        )}

        {studio.equipment && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3">Оборудование</h3>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-sm text-foreground/80 leading-relaxed">{studio.equipment}</p>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Owner */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Владелец</h3>
          <Link to={`/profile/${studio.owner?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="w-12 h-12">
              <AvatarImage src={studio.owner?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {ownerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{ownerName}</p>
              {studio.owner?.username && (
                <p className="text-sm text-muted-foreground">@{studio.owner.username}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Отзывы</h3>
                <div className="flex items-center gap-1.5">
                  <StarRating value={rating.avg} size="sm" />
                  <span className="text-sm font-bold">{rating.avg}</span>
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map((r) => {
                  const rName = r.reviewer?.display_name || r.reviewer?.username || "Пользователь";
                  return (
                    <div key={r.id} className="flex gap-3">
                      <Avatar className="w-9 h-9 flex-shrink-0">
                        <AvatarImage src={r.reviewer?.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-primary/20 text-xs font-semibold">
                          {rName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <Link to={`/profile/${r.reviewer?.username}`} className="font-medium text-sm hover:underline truncate">
                            {rName}
                          </Link>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: ru })}
                          </span>
                        </div>
                        <StarRating value={r.rating} size="sm" />
                        {r.comment && (
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.comment}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground">
          Добавлено {formatDistanceToNow(new Date(studio.created_at), { addSuffix: true, locale: ru })}
        </div>
      </div>

      {/* Mobile sticky booking bar */}
      {!isOwner && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-40">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div>
              <p className="text-lg font-bold">
                ₽{studio.price_per_hour.toLocaleString("ru-RU")}
                <span className="text-sm font-normal text-muted-foreground">/час</span>
              </p>
            </div>
            <Button
              className="flex-1 bg-gradient-primary hover:shadow-neon"
              onClick={() => void handleBook()}
              disabled={booking}
            >
              {booking ? "Отправляем запрос..." : "Забронировать"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioDetail;
