import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BottomNav } from "./components/layout/BottomNav";
import { SidebarNav } from "./components/layout/SidebarNav";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings/:bookingId"
                  element={
                    <ProtectedRoute>
                      <BookingDetail />
                    </ProtectedRoute>
                  }
                />
                <Route path="/studio" element={<Studio />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/studios" element={<Studios />} />
                <Route path="/studios/:id" element={<StudioDetail />} />
                <Route
                  path="/add-studio"
                  element={
                    <ProtectedRoute>
                      <AddStudio />
                    </ProtectedRoute>
                  }
                />
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
