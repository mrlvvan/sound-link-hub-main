import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/formatPrice";
import { CalendarIcon, Clock } from "lucide-react";
import { format, differenceInHours, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PaymentSheet } from "../orders/PaymentSheet";

interface CreateBookingDialogProps {
  studioName: string;
  ownerUsername: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerSession?: number;
  /** Требуется ли предоплата (настройка студии, по желанию) */
  requiresPrepayment?: boolean;
  /** Процент предоплаты 0–50 (если требуется) */
  prepaymentPercent?: number;
  children?: React.ReactNode;
}

export const CreateBookingDialog = ({
  studioName,
  ownerUsername,
  pricePerHour,
  pricePerDay,
  pricePerSession,
  requiresPrepayment = false,
  prepaymentPercent = 50,
  children
}: CreateBookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rentalType, setRentalType] = useState<"hourly" | "daily" | "session">("hourly");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState("14:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Available additional services
  const services = [
    { id: "engineer", name: "Звукорежиссер", price: 2000 },
    { id: "video", name: "Видеосъемка", price: 5000 },
    { id: "photo", name: "Фотограф", price: 3000 },
  ];

  // Calculate duration and price
  const calculateBooking = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set times
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    start.setHours(startHour, startMinute);
    end.setHours(endHour, endMinute);

    let duration = "";
    let basePrice = 0;

    if (rentalType === "hourly" && pricePerHour) {
      const hours = differenceInHours(end, start);
      duration = `${hours} ${hours === 1 ? "час" : hours < 5 ? "часа" : "часов"}`;
      basePrice = pricePerHour * hours;
    } else if (rentalType === "daily" && pricePerDay) {
      const days = differenceInDays(end, start) + 1;
      duration = `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`;
      basePrice = pricePerDay * days;
    } else if (rentalType === "session" && pricePerSession) {
      duration = "Сессия под ключ";
      basePrice = pricePerSession;
    }

    const additionalPrice = services
      .filter(s => additionalServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);

    const totalBeforeFee = basePrice + additionalPrice;
    const platformFee = Math.round(totalBeforeFee * 0.1);
    const total = totalBeforeFee + platformFee;
    const percent = Math.min(50, Math.max(0, prepaymentPercent || 0));
    const prepaymentAmount = requiresPrepayment ? Math.round(total * (percent / 100)) : 0;

    return {
      duration,
      basePrice,
      additionalPrice,
      platformFee,
      total,
      prepaymentAmount,
      start: format(start, "d MMMM yyyy, HH:mm", { locale: ru }),
      end: format(end, "d MMMM yyyy, HH:mm", { locale: ru })
    };
  };

  const booking = calculateBooking();

  const handleProceedToPayment = () => {
    if (!booking || !startDate || !endDate) return;
    setOpen(false);
    setPaymentOpen(true);
  };

  const bookingSummary = booking ? {
    type: "booking" as const,
    service: studioName,
    provider: ownerUsername,
    studio: studioName,
    startDate: booking.start,
    endDate: booking.end,
    duration: booking.duration,
    price: booking.basePrice + booking.additionalPrice,
    platformFee: booking.platformFee,
    total: booking.total,
    requiresPrepayment,
    prepaymentPercent: requiresPrepayment ? Math.min(50, Math.max(0, prepaymentPercent || 0)) : 0,
    prepaymentAmount: booking.prepaymentAmount ?? 0
  } : {
    type: "booking" as const,
    service: studioName,
    provider: ownerUsername,
    price: 0,
    platformFee: 0,
    total: 0,
    prepaymentAmount: 0
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || <Button className="bg-gradient-primary hover:shadow-neon">Забронировать</Button>}
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Бронирование студии</DialogTitle>
            <p className="text-sm text-muted-foreground">{studioName}</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rental Type */}
            <div className="space-y-2">
              <Label>Тип аренды</Label>
              <Select value={rentalType} onValueChange={(v: any) => setRentalType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pricePerHour && (
                    <SelectItem value="hourly">Почасовая — {formatPrice(pricePerHour)}/час</SelectItem>
                  )}
                  {pricePerDay && (
                    <SelectItem value="daily">Посуточная — {formatPrice(pricePerDay)}/день</SelectItem>
                  )}
                  {pricePerSession && (
                    <SelectItem value="session">Сессия под ключ — {formatPrice(pricePerSession)}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Дата начала</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "d MMM", { locale: ru }) : "Выбрать"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Время</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 14 }, (_, i) => i + 10).map(hour => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* End Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Дата окончания</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "d MMM", { locale: ru }) : "Выбрать"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => !startDate || date < startDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Время</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 14 }, (_, i) => i + 10).map(hour => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-3">
              <Label>Дополнительные услуги</Label>
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={additionalServices.includes(service.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAdditionalServices([...additionalServices, service.id]);
                      } else {
                        setAdditionalServices(additionalServices.filter(id => id !== service.id));
                      }
                    }}
                  />
                  <Label
                    htmlFor={service.id}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <span>{service.name}</span>
                    <span className="text-muted-foreground">+{formatPrice(service.price)}</span>
                  </Label>
                </div>
              ))}
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="requests">Особые пожелания (опционально)</Label>
              <Textarea
                id="requests"
                placeholder="Например: нужна помощь с настройкой оборудования"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value.slice(0, 300))}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Price Summary */}
            {booking && (
              <>
                <Separator />
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Итого</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Аренда ({booking.duration})</span>
                      <span className="font-medium">{formatPrice(booking.basePrice)}</span>
                    </div>
                    {booking.additionalPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Доп. услуги</span>
                        <span className="font-medium">{formatPrice(booking.additionalPrice)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Комиссия (10%)</span>
                      <span className="font-medium">{formatPrice(booking.platformFee)}</span>
                    </div>
                    {requiresPrepayment && booking.prepaymentAmount > 0 && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-primary font-medium">
                          <span>Предоплата (до 50%)</span>
                          <span>{formatPrice(booking.prepaymentAmount)}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Остаток — при/после аренды
                        </p>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Итого</span>
                      <span className="font-bold text-primary">{formatPrice(booking.total)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              className="w-full h-12 bg-gradient-primary hover:shadow-neon"
              onClick={handleProceedToPayment}
              disabled={!booking || !startDate || !endDate}
            >
              {requiresPrepayment && booking?.prepaymentAmount
                ? `Забронировать (предоплата ${formatPrice(booking.prepaymentAmount)})`
                : "Забронировать"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentSheet
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        orderSummary={bookingSummary}
      />
    </>
  );
};
