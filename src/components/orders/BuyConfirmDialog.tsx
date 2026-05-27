import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Briefcase, Package, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder, ITEM_TYPE_LABELS, type OrderItemType } from "@/lib/orders";
import { getBeatLicenses, LICENSE_TIERS, type LicenseRecord } from "@/lib/licenses";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    type: OrderItemType;
    title: string;
    price: number;
    sellerId: string;
    sellerUsername: string;
  };
};

const typeIcons: Record<OrderItemType, React.ElementType> = {
  beat: ShoppingBag,
  service: Briefcase,
  product: Package,
};

export const BuyConfirmDialog = ({ open, onOpenChange, item }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [licensesLoading, setLicensesLoading] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<LicenseRecord | null>(null);

  const isBeat = item.type === "beat";
  const Icon = typeIcons[item.type];

  // Load licenses when dialog opens for a beat
  useEffect(() => {
    if (!open || !isBeat) return;
    setSelectedLicense(null);
    setLicensesLoading(true);
    getBeatLicenses(item.id)
      .then((list) => {
        setLicenses(list);
        if (list.length > 0) setSelectedLicense(list[0]); // pre-select cheapest
      })
      .catch(() => setLicenses([]))
      .finally(() => setLicensesLoading(false));
  }, [open, item.id, isBeat]);

  const effectivePrice = isBeat && selectedLicense ? selectedLicense.price : item.price;

  const handleConfirm = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      const order = await createOrder({
        buyerId: user.id,
        sellerId: item.sellerId,
        itemType: item.type,
        itemId: item.id,
        amount: effectivePrice,
        licenseId: selectedLicense?.id,
        licenseName: selectedLicense?.label,
      });
      toast.success("Заказ создан");
      onOpenChange(false);
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка создания заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            Оформить заказ
          </DialogTitle>
          <DialogDescription>
            Заказ будет отправлен продавцу. После его принятия откроется чат.
          </DialogDescription>
        </DialogHeader>

        {/* License picker for beats */}
        {isBeat && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Выберите лицензию
            </p>
            {licensesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : licenses.length > 0 ? (
              <div className="space-y-2">
                {licenses.map((lic) => {
                  const tierDef = LICENSE_TIERS.find((t) => t.name === lic.name);
                  const isSelected = selectedLicense?.id === lic.id;
                  return (
                    <button
                      key={lic.id}
                      type="button"
                      onClick={() => setSelectedLicense(lic)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 rounded-xl border p-3 transition-all text-left",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", tierDef?.badgeClass)}>
                            {lic.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </div>
                        {lic.description && (
                          <p className="text-[11px] text-muted-foreground leading-tight">{lic.description}</p>
                        )}
                      </div>
                      <p className="font-bold text-primary text-base flex-shrink-0">
                        ₽{lic.price.toLocaleString("ru-RU")}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              // No licenses configured — single price fallback
              <div className="rounded-xl border border-border p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Стандартная лицензия</span>
                <span className="font-bold text-primary">₽{item.price.toLocaleString("ru-RU")}</span>
              </div>
            )}
          </div>
        )}

        {/* Order summary */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate">{item.title}</span>
            <Badge variant="outline" className="text-[11px] flex-shrink-0">
              {ITEM_TYPE_LABELS[item.type]}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Продавец</span>
            <span className="font-medium">@{item.sellerUsername}</span>
          </div>
          {isBeat && selectedLicense && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Лицензия</span>
              <span className="font-medium">{selectedLicense.label}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-1 border-t border-border/50">
            <span className="text-muted-foreground">Сумма</span>
            <span className="font-bold text-primary text-lg">
              ₽{effectivePrice.toLocaleString("ru-RU")}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Оплата происходит через гарант-платформу после подтверждения заказа продавцом.
        </p>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={loading}>
            Отмена
          </Button>
          <Button
            className="flex-1"
            onClick={() => void handleConfirm()}
            disabled={loading || (isBeat && licensesLoading)}
          >
            {loading ? "Создаю..." : "Оформить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
