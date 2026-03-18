import { Shield, Palette, Globe, CreditCard, Bell, Info, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const {
    messagesAccess,
    theme,
    language,
    paymentMethod,
    paymentDetails,
    paymentBank,
    notificationsEnabled,
    orderNotifications,
    messageNotifications,
    showActivity,
    setMessagesAccess,
    setTheme,
    setLanguage,
    setPaymentMethod,
    setPaymentDetails,
    setPaymentBank,
    setNotificationsEnabled,
    setOrderNotifications,
    setMessageNotifications,
    setShowActivity,
  } = useSettingsStore();

  const handlePaymentDetailsChange = (value: string) => {
    setPaymentDetails(value);
    toast.success("Платёжная информация сохранена");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full max-h-full p-0 gap-0 m-0 rounded-none overflow-y-auto">
        <DialogHeader className="px-4 pt-4 pb-3 sticky top-0 bg-background z-10 border-b border-border">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </Button>
            <DialogTitle className="text-xl font-semibold">Настройки</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-0">
          {/* Privacy Section */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium">Приватность и безопасность</h3>
            </div>
            
            <div className="space-y-3">
              <div className="pl-8">
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-sm">Доступ к сообщениям</p>
                    <p className="text-xs text-muted-foreground">Кто может вам написать</p>
                  </div>
                  <Select value={messagesAccess} onValueChange={setMessagesAccess}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Все</SelectItem>
                      <SelectItem value="followers">Подписчики</SelectItem>
                      <SelectItem value="nobody">Никто</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-sm">Показывать активность</p>
                    <p className="text-xs text-muted-foreground">Другие увидят, когда вы были в сети</p>
                  </div>
                  <Switch checked={showActivity} onCheckedChange={setShowActivity} />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance Section */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium">Внешний вид</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div>
                <p className="text-sm mb-2">Тема приложения</p>
                <Tabs value={theme} onValueChange={(value: any) => setTheme(value)} className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="light" className="text-xs">Светлая</TabsTrigger>
                    <TabsTrigger value="dark" className="text-xs">Тёмная</TabsTrigger>
                    <TabsTrigger value="system" className="text-xs">Системная</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <p className="text-sm mb-2">Язык интерфейса</p>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Section */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium">Платёжная информация</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div>
                <p className="text-sm mb-2">Реквизиты для получения (П2П)</p>
              </div>
              <div>
                <p className="text-sm mb-2">Банк</p>
                <Select value={paymentBank} onValueChange={setPaymentBank}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Выберите банк" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="sber">Сбербанк</SelectItem>
                    <SelectItem value="tinkoff">Тинькофф</SelectItem>
                    <SelectItem value="alfa">Альфа-Банк</SelectItem>
                    <SelectItem value="vtb">ВТБ</SelectItem>
                    <SelectItem value="raiffeisen">Райффайзен</SelectItem>
                    <SelectItem value="gazprom">Газпромбанк</SelectItem>
                    <SelectItem value="otkritie">Открытие</SelectItem>
                    <SelectItem value="other">Другой</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm mb-2">Номер карты для перевода</p>
                <Input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Пользователи переводят вам напрямую (П2П)
                </p>
              </div>

              <Button 
                onClick={() => handlePaymentDetailsChange(paymentDetails)}
                className="w-full bg-gradient-primary hover:shadow-neon"
                size="sm"
              >
                Сохранить платёжные данные
              </Button>
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium">Уведомления</h3>
            </div>
            
            <div className="space-y-3 pl-8">
              <div className="flex items-center justify-between py-1">
                <p className="text-sm">Push-уведомления</p>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between py-1">
                <p className="text-sm">Уведомления о заказах</p>
                <Switch 
                  checked={orderNotifications} 
                  onCheckedChange={setOrderNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <p className="text-sm">Уведомления о сообщениях</p>
                <Switch 
                  checked={messageNotifications} 
                  onCheckedChange={setMessageNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Section */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <LogOut className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium">Аккаунт</h3>
            </div>
            <div className="pl-8">
              <Button
                variant="outline"
                className="w-full border-destructive/30 hover:bg-destructive/10 text-destructive"
                onClick={async () => {
                  await signOut();
                  onOpenChange(false);
                  navigate("/login");
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>

          <Separator />

          {/* About Section */}
          <div className="py-3">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-medium">О приложении</h3>
            </div>
            
            <div className="space-y-2 pl-8">
              <div className="py-2">
                <p className="text-sm text-muted-foreground">Версия</p>
                <p className="text-sm font-medium">1.0.0</p>
              </div>

              <div className="py-2">
                <a href="#" className="text-sm text-primary hover:underline">
                  Правила пользования
                </a>
              </div>

              <div className="py-2">
                <a href="#" className="text-sm text-primary hover:underline">
                  Политика конфиденциальности
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
