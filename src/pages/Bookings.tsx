import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, RefreshCcw, ChevronRight, Home, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMyBookings,
  STATUS_LABELS,
  STATUS_COLORS,
  type BookingRecord,
} from "@/lib/bookings";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const BookingRow = ({ booking, isRenter }: { booking: BookingRecord; isRenter: boolean }) => {
  const partner = isRenter ? booking.owner : booking.renter;
  const partnerName = partner?.display_name || partner?.username || "—";
  const studioName = booking.studio?.name ?? "Студия";
  const start = new Date(booking.start_time);

  return (
    <Link
      to={`/bookings/${booking.id}`}
      className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
        <Calendar className="w-5 h-5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{studioName}</span>
          <Badge className={`text-[10px] h-4 px-1.5 border ${STATUS_COLORS[booking.status]}`} variant="outline">
            {STATUS_LABELS[booking.status]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {isRenter ? "Владелец" : "Арендатор"}: @{partner?.username || "—"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {start.toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-bold text-sm">₽{booking.total_price.toLocaleString("ru-RU")}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </Link>
  );
};

const EmptyBookings = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center py-16 text-center">
    <Calendar className="w-12 h-12 text-muted-foreground/30 mb-3" />
    <p className="font-semibold">{text}</p>
    <p className="text-sm text-muted-foreground mt-1">Бронирования появятся здесь</p>
    <Link to="/studios" className="mt-4">
      <Button variant="outline" size="sm">Найти студию</Button>
    </Link>
  </div>
);

const Bookings = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [asRenter, setAsRenter] = useState<BookingRecord[]>([]);
  const [asOwner, setAsOwner] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      const data = await getMyBookings(user.id);
      setAsRenter(data.asRenter);
      setAsOwner(data.asOwner);
    } catch {
      toast.error("Не удалось загрузить бронирования");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [user]);

  const activeStatuses = new Set(["pending", "confirmed", "active"]);
  const renterActive = asRenter.filter((b) => activeStatuses.has(b.status));
  const renterDone = asRenter.filter((b) => !activeStatuses.has(b.status));
  const ownerActive = asOwner.filter((b) => activeStatuses.has(b.status));
  const ownerDone = asOwner.filter((b) => !activeStatuses.has(b.status));

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 px-4 lg:px-8 max-w-lg mx-auto"
      style={{ paddingTop: isFullscreen ? `calc(1.5rem + ${safeAreaTopInset}px)` : "1.5rem" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Бронирования</h1>
        <Button variant="ghost" size="icon" onClick={() => void load()} disabled={loading}>
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <Tabs defaultValue="renter">
        <TabsList className="w-full grid grid-cols-2 mb-5">
          <TabsTrigger value="renter" className="gap-1.5">
            <Home className="w-4 h-4" />
            Я снимаю
            {renterActive.length > 0 && (
              <Badge variant="default" className="h-4 text-[10px] px-1">{renterActive.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="owner" className="gap-1.5">
            <Briefcase className="w-4 h-4" />
            Моя студия
            {ownerActive.length > 0 && (
              <Badge variant="default" className="h-4 text-[10px] px-1">{ownerActive.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Я снимаю */}
        <TabsContent value="renter" className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Активные · {renterActive.length}
                </h2>
                {renterActive.length > 0 ? (
                  <div className="space-y-3">
                    {renterActive.map((b) => <BookingRow key={b.id} booking={b} isRenter />)}
                  </div>
                ) : (
                  <EmptyBookings text="Нет активных бронирований" />
                )}
              </section>

              {renterDone.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    История · {renterDone.length}
                  </h2>
                  <div className="space-y-3">
                    {renterDone.map((b) => <BookingRow key={b.id} booking={b} isRenter />)}
                  </div>
                </section>
              )}
            </>
          )}
        </TabsContent>

        {/* Моя студия */}
        <TabsContent value="owner" className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Входящие · {ownerActive.length}
                </h2>
                {ownerActive.length > 0 ? (
                  <div className="space-y-3">
                    {ownerActive.map((b) => <BookingRow key={b.id} booking={b} isRenter={false} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-16 text-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="font-semibold">Нет входящих бронирований</p>
                    <p className="text-sm text-muted-foreground mt-1">Добавьте студию на платформу</p>
                    <Link to="/add-studio" className="mt-4">
                      <Button variant="outline" size="sm">Добавить студию</Button>
                    </Link>
                  </div>
                )}
              </section>

              {ownerDone.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    История · {ownerDone.length}
                  </h2>
                  <div className="space-y-3">
                    {ownerDone.map((b) => <BookingRow key={b.id} booking={b} isRenter={false} />)}
                  </div>
                </section>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
