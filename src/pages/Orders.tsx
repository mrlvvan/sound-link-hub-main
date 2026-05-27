import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, RefreshCcw, ChevronRight, ShoppingBag, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  getMyOrders,
  STATUS_LABELS,
  STATUS_COLORS,
  ITEM_TYPE_LABELS,
  type OrderRecord,
} from "@/lib/orders";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

const OrderRow = ({ order, isBuyer }: { order: OrderRecord; isBuyer: boolean }) => {
  const partner = isBuyer ? order.seller : order.buyer;
  const partnerName = partner?.display_name || partner?.username || "—";

  return (
    <Link
      to={`/orders/${order.id}`}
      className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-all group"
    >
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={partner?.avatar_url ?? undefined} />
        <AvatarFallback className="bg-primary/20 text-sm font-semibold">
          {partnerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{ITEM_TYPE_LABELS[order.item_type]}</span>
          <Badge className={`text-[10px] h-4 px-1.5 border ${STATUS_COLORS[order.status]}`} variant="outline">
            {STATUS_LABELS[order.status]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {isBuyer ? "Продавец" : "Покупатель"}: @{partner?.username || "—"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ru })}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-bold text-sm">₽{order.amount.toLocaleString("ru-RU")}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </Link>
  );
};

const EmptyOrders = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center py-16 text-center">
    <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
    <p className="font-semibold">{text}</p>
    <p className="text-sm text-muted-foreground mt-1">Заказы появятся здесь</p>
  </div>
);

const Orders = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [asBuyer, setAsBuyer] = useState<OrderRecord[]>([]);
  const [asSeller, setAsSeller] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      const data = await getMyOrders(user.id);
      setAsBuyer(data.asBuyer);
      setAsSeller(data.asSeller);
    } catch {
      toast.error("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [user]);

  const activeStatuses = new Set(["pending", "accepted", "paid"]);
  const buyerActive = asBuyer.filter((o) => activeStatuses.has(o.status));
  const buyerDone = asBuyer.filter((o) => !activeStatuses.has(o.status));
  const sellerActive = asSeller.filter((o) => activeStatuses.has(o.status));
  const sellerDone = asSeller.filter((o) => !activeStatuses.has(o.status));

  return (
    <div
      className="min-h-screen pb-24 lg:pb-6 px-4 lg:px-8 max-w-lg mx-auto"
      style={{ paddingTop: isFullscreen ? `calc(1.5rem + ${safeAreaTopInset}px)` : "1.5rem" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Заказы</h1>
        <Button variant="ghost" size="icon" onClick={() => void load()} disabled={loading}>
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <Tabs defaultValue="buyer">
        <TabsList className="w-full grid grid-cols-2 mb-5">
          <TabsTrigger value="buyer" className="gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            Я покупаю
            {buyerActive.length > 0 && (
              <Badge variant="default" className="h-4 text-[10px] px-1">{buyerActive.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="seller" className="gap-1.5">
            <Briefcase className="w-4 h-4" />
            Я продаю
            {sellerActive.length > 0 && (
              <Badge variant="default" className="h-4 text-[10px] px-1">{sellerActive.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Я покупаю ── */}
        <TabsContent value="buyer" className="space-y-6">
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
                  Активные · {buyerActive.length}
                </h2>
                {buyerActive.length > 0 ? (
                  <div className="space-y-3">
                    {buyerActive.map((o) => <OrderRow key={o.id} order={o} isBuyer />)}
                  </div>
                ) : (
                  <EmptyOrders text="Нет активных заказов" />
                )}
              </section>

              {buyerDone.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    История · {buyerDone.length}
                  </h2>
                  <div className="space-y-3">
                    {buyerDone.map((o) => <OrderRow key={o.id} order={o} isBuyer />)}
                  </div>
                </section>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Я продаю ── */}
        <TabsContent value="seller" className="space-y-6">
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
                  Входящие · {sellerActive.length}
                </h2>
                {sellerActive.length > 0 ? (
                  <div className="space-y-3">
                    {sellerActive.map((o) => <OrderRow key={o.id} order={o} isBuyer={false} />)}
                  </div>
                ) : (
                  <EmptyOrders text="Нет входящих заказов" />
                )}
              </section>

              {sellerDone.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    История · {sellerDone.length}
                  </h2>
                  <div className="space-y-3">
                    {sellerDone.map((o) => <OrderRow key={o.id} order={o} isBuyer={false} />)}
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

export default Orders;
