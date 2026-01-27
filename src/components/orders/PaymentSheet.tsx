import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/formatPrice";
import { CreditCard, Smartphone, Wallet, CheckCircle2, Loader2 } from "lucide-react";
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
}

interface PaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderSummary: OrderSummary;
}

const paymentMethods = [
  { id: "card", name: "Банковская карта", icon: CreditCard },
  { id: "sbp", name: "СБП", icon: Smartphone },
  { id: "wallet", name: "Электронный кошелек", icon: Wallet },
];

export const PaymentSheet = ({ open, onOpenChange, orderSummary }: PaymentSheetProps) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!agreedToTerms) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Show success for 1.5 seconds then navigate
    setTimeout(() => {
      toast.success("Оплата успешно проведена! Средства заморожены на платформе.");
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
          <SheetTitle className="text-2xl">Оплата</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Оплата прошла успешно!</h3>
              <p className="text-muted-foreground text-center">
                Средства заморожены на платформе
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
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Итого</span>
                    <span className="font-bold text-lg text-primary">{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Способ оплаты</Label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{method.name}</span>
                        {selectedMethod === method.id && (
                          <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />
                        )}
                      </button>
                    );
                  })}
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

              {/* Info Block */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-1">💰 Защита покупателя</p>
                <p className="text-xs text-muted-foreground">
                  Деньги будут заморожены на платформе и переведены исполнителю только после 
                  {orderSummary.type === "order" ? " принятия работы" : " завершения аренды"}.
                </p>
              </div>

              {/* Payment Button */}
              <Button
                className="w-full h-12 text-base bg-gradient-primary hover:shadow-neon"
                onClick={handlePayment}
                disabled={!agreedToTerms || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обработка...
                  </>
                ) : (
                  `Оплатить ${formatPrice(orderSummary.total)}`
                )}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
