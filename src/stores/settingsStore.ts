import { create } from 'zustand';

type MessagesAccess = 'everyone' | 'followers' | 'nobody';
type Theme = 'light' | 'dark' | 'system';
type Language = 'ru' | 'en';
type PaymentMethod = 'card';

interface SettingsState {
  isFullscreen: boolean;
  safeAreaTopInset: number;
  messagesAccess: MessagesAccess;
  theme: Theme;
  language: Language;
  paymentMethod: PaymentMethod;
  paymentDetails: string;
  paymentBank: string;
  notificationsEnabled: boolean;
  orderNotifications: boolean;
  messageNotifications: boolean;
  showActivity: boolean;
  setIsFullscreen: (value: boolean) => void;
  updateSafeAreaInsets: () => void;
  setMessagesAccess: (value: MessagesAccess) => void;
  setTheme: (value: Theme) => void;
  setLanguage: (value: Language) => void;
  setPaymentMethod: (value: PaymentMethod) => void;
  setPaymentDetails: (value: string) => void;
  setPaymentBank: (value: string) => void;
  setNotificationsEnabled: (value: boolean) => void;
  setOrderNotifications: (value: boolean) => void;
  setMessageNotifications: (value: boolean) => void;
  setShowActivity: (value: boolean) => void;
}

const THEME_KEY = "soundlink-theme";

function loadTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const s = localStorage.getItem(THEME_KEY);
  return s === "light" || s === "dark" || s === "system" ? s : "system";
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isFullscreen: false,
  safeAreaTopInset: 0,
  messagesAccess: 'everyone',
  theme: loadTheme(),
  language: 'ru',
  paymentMethod: 'card',
  paymentDetails: '',
  paymentBank: '',
  notificationsEnabled: true,
  orderNotifications: true,
  messageNotifications: true,
  showActivity: true,
  setIsFullscreen: (value) => set({ isFullscreen: value }),
  updateSafeAreaInsets: () => set({ safeAreaTopInset: 0 }),
  setMessagesAccess: (value) => set({ messagesAccess: value }),
  setTheme: (value) => {
    set({ theme: value });
    if (typeof window !== "undefined") localStorage.setItem(THEME_KEY, value);
  },
  setLanguage: (value) => set({ language: value }),
  setPaymentMethod: (value) => set({ paymentMethod: value }),
  setPaymentDetails: (value) => set({ paymentDetails: value }),
  setPaymentBank: (value) => set({ paymentBank: value }),
  setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
  setOrderNotifications: (value) => set({ orderNotifications: value }),
  setMessageNotifications: (value) => set({ messageNotifications: value }),
  setShowActivity: (value) => set({ showActivity: value }),
}));