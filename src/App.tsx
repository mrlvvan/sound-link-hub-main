import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/layout/BottomNav";
import { SidebarNav } from "./components/layout/SidebarNav";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Studio from "./pages/Studio";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Studios from "./pages/Studios";
import StudioDetail from "./pages/StudioDetail";
import AddStudio from "./pages/AddStudio";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useSettingsStore } from "./stores/settingsStore";
import { isMobileDevice } from "./lib/utils";

const queryClient = new QueryClient();

const App = () => {
  const { setIsFullscreen, updateSafeAreaInsets } = useSettingsStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;
      
        if (tg) {
          tg.ready?.();
          tg.expand?.();
          
          try {
            if (isMobileDevice()) {
              await tg.requestFullscreen?.()
              
              setTimeout(() => {
                updateSafeAreaInsets();
              }, 200)
              setIsFullscreen(true);
            }
          } catch {}
        }
      } catch (error) {
        console.error(error);
      }
    };

    initializeApp();
  }, [setIsFullscreen, updateSafeAreaInsets]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background flex">
            <SidebarNav />
            <main className="flex-1 lg:ml-64">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/search" element={<Search />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/bookings/:bookingId" element={<BookingDetail />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/studios" element={<Studios />} />
                <Route path="/studios/:id" element={<StudioDetail />} />
                <Route path="/add-studio" element={<AddStudio />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
