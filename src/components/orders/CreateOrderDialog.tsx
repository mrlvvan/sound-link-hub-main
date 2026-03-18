import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { CalendarIcon, Package } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PaymentSheet } from "./PaymentSheet";

interface CreateOrderDialogProps {
  providerUsername: string;
  providerServices: Array<{ id: string; name: string; price: number }>;
  children?: React.ReactNode;
}

export const CreateOrderDialog = ({ providerUsername, providerServices, children }: CreateOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const selectedServiceData = providerServices.find(s => s.id === selectedService);
  const servicePrice = selectedServiceData?.price || 0;
  const platformFee = Math.round(servicePrice * 0.1);
  const totalPrice = servicePrice + platformFee;

  const handleProceedToPayment = () => {
    if (!selectedService || !requirements || !deadline) return;
    setOpen(false);
    setPaymentOpen(true);
  };

  const orderSummary = {
    type: "order" as const,
    service: selectedServiceData?.name || "",
    provider: providerUsername,
    requirements,
    deadline: deadline ? format(deadline, "d MMMM yyyy", { locale: ru }) : "",
    price: servicePrice,
    platformFee,
    total: totalPrice
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || <Button className="bg-gradient-primary hover:shadow-neon">Заказать услугу</Button>}
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оформление заказа</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service">Выберите услугу</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Выберите услугу" />
                </SelectTrigger>
                <SelectContent>
                  {providerServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} — {formatPrice(service.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">
                Описание требований
                <span className="text-muted-foreground ml-2">({requirements.length}/500)</span>
              </Label>
              <Textarea
                id="requirements"
                placeholder="Опишите подробно, что вам нужно..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value.slice(0, 500))}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label>Срок выполнения</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 3);
                    setDeadline(date);
                  }}
                >
                  3 дня
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    setDeadline(date);
                  }}
                >
                  Неделя
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 14);
                    setDeadline(date);
                  }}
                >
                  2 недели
                </Button>
              </div>
            </div>

            {/* Price Breakdown */}
            {selectedService && (
              <>
                <Separator />
                <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Стоимость</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Услуга</span>
                      <span className="font-medium">{formatPrice(servicePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Комиссия платформы (10%)</span>
                      <span className="font-medium">{formatPrice(platformFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Итого</span>
                      <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-3">
                    <p className="text-xs text-muted-foreground">
                      🤝 П2П: переводы напрямую исполнителю. Платформа — гарант сделки.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* CTA */}
            <Button
              className="w-full h-12 bg-gradient-primary hover:shadow-neon"
              onClick={handleProceedToPayment}
              disabled={!selectedService || !requirements || !deadline}
            >
              Продолжить к оплате
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentSheet
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        orderSummary={orderSummary}
      />
    </>
  );
};
