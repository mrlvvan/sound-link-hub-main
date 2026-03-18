import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/formatPrice";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OrderSummary {
  type: "order" | "booking";
  service: string;
  provider: string;
  requirements?: string;
  deadline?: string;
  studio?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  price: number;
  platformFee: number;
  total: number;
  requiresPrepayment?: boolean;
  prepaymentPercent?: number;
  prepaymentAmount?: number;
}

interface PaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderSummary: OrderSummary;
}

export const PaymentSheet = ({ open, onOpenChange, orderSummary }: PaymentSheetProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const prepayment = orderSummary.type === "booking" && orderSummary.requiresPrepayment && orderSummary.prepaymentAmount
    ? orderSummary.prepaymentAmount
    : 0;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!agreedToTerms) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsSuccess(true);

    setTimeout(() => {
      toast.success(
        prepayment > 0
          ? "Бронирование подтверждено! Переведите предоплату владельцу по реквизитам в чате."
          : "Сделка подтверждена! Переведите средства напрямую контрагенту по реквизитам в чате."
      );
      onOpenChange(false);
      setIsSuccess(false);
      setAgreedToTerms(false);
      
      if (orderSummary.type === "order") {
        navigate("/orders");
      } else {
        navigate("/bookings");
      }
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {orderSummary.type === "booking" ? "Подтверждение бронирования" : "Подтверждение сделки"}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Сделка подтверждена!</h3>
              <p className="text-muted-foreground text-center">
                Переведите средства напрямую контрагенту по реквизитам в чате
              </p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg">{orderSummary.service}</h3>
                <p className="text-sm text-muted-foreground">@{orderSummary.provider}</p>
                
                {orderSummary.type === "order" && (
                  <>
                    {orderSummary.deadline && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Срок:</span> {orderSummary.deadline}
                      </p>
                    )}
                  </>
                )}

                {orderSummary.type === "booking" && (
                  <>
                    {orderSummary.startDate && orderSummary.endDate && (
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-muted-foreground">Начало:</span> {orderSummary.startDate}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Окончание:</span> {orderSummary.endDate}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Длительность:</span> {orderSummary.duration}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость</span>
                    <span className="font-medium">{formatPrice(orderSummary.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Комиссия (10%)</span>
                    <span className="font-medium">{formatPrice(orderSummary.platformFee)}</span>
                  </div>
                  {prepayment > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between text-primary font-medium">
                        <span>Предоплата ({orderSummary.prepaymentPercent}%)</span>
                        <span>{formatPrice(prepayment)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground text-xs">
                        <span>Остаток — при/после аренды</span>
                        <span>{formatPrice(orderSummary.total - prepayment)}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Итого</span>
                    <span className="font-bold text-lg text-primary">{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Согласен с условиями платформы и политикой возврата средств
                </Label>
              </div>

              {/* P2P Info Block */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  П2П: платформа — гарант сделки
                </p>
                <p className="text-xs text-muted-foreground">
                  Вы переводите деньги напрямую контрагенту (карта, перевод). Платформа не держит средства,
                  но гарантирует сделку и поможет в случае спора. Реквизиты — в чате после подтверждения.
                </p>
              </div>

              {/* Confirm Button */}
              <Button
                className="w-full h-12 text-base bg-gradient-primary hover:shadow-neon"
                onClick={handleConfirm}
                disabled={!agreedToTerms || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Подтверждение...
                  </>
                ) : orderSummary.type === "booking" ? (
                  prepayment > 0
                    ? `Подтвердить бронирование (предоплата ${formatPrice(prepayment)})`
                    : "Подтвердить бронирование"
                ) : (
                  "Подтвердить сделку"
                )}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
