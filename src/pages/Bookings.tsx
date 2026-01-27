import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/components/studios/BookingCard";
import { useSettingsStore } from "@/stores/settingsStore";

const Bookings = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();

  const myBookings = {
    upcoming: [
      {
        id: 1,
        studio: "Studio Flow",
        photo: "/images/studios/studio-flow-1.jpg",
        address: "Москва, ул. Тверская, 15",
        startDate: "20 окт 2025, 15:00",
        endDate: "20 окт 2025, 19:00",
        duration: "4 часа",
        status: "confirmed" as const,
        price: 11000,
        ownerUsername: "studioflow_owner",
      },
      {
        id: 2,
        studio: "RepBaza Central",
        photo: "/images/studios/repbaza-central.jpg",
        address: "Москва, ул. Ленина, 42",
        startDate: "25 окт 2025, 10:00",
        endDate: "25 окт 2025, 18:00",
        duration: "8 часов",
        status: "pending" as const,
        price: 14000,
        ownerUsername: "repbaza_central",
      },
    ],
    completed: [
      {
        id: 3,
        studio: "Trap House Studio",
        photo: "/images/studios/trap-house.jpg",
        address: "Москва, ул. Арбат, 28",
        startDate: "10 окт 2025, 14:00",
        endDate: "10 окт 2025, 20:00",
        duration: "6 часов",
        status: "completed" as const,
        price: 13000,
        ownerUsername: "traphouse_owner",
      },
    ],
    cancelled: [
      {
        id: 4,
        studio: "Premium Records",
        photo: "/images/studios/premium-records.jpg",
        address: "Москва, ул. Пушкина, 10",
        startDate: "12 окт 2025, 12:00",
        endDate: "12 окт 2025, 16:00",
        duration: "4 часа",
        status: "cancelled" as const,
        price: 9000,
        ownerUsername: "premium_records",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      <h1 className="text-3xl font-bold mb-6">Бронирования</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          <TabsTrigger value="completed">Завершённые</TabsTrigger>
          <TabsTrigger value="cancelled">Отменённые</TabsTrigger>
        </TabsList>

        {/* Upcoming Bookings */}
        <TabsContent value="upcoming" className="space-y-3">
          {myBookings.upcoming.length > 0 ? (
            myBookings.upcoming.map((booking) => (
              <BookingCard key={booking.id} {...booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Нет предстоящих бронирований</p>
            </div>
          )}
        </TabsContent>

        {/* Completed Bookings */}
        <TabsContent value="completed" className="space-y-3">
          {myBookings.completed.length > 0 ? (
            myBookings.completed.map((booking) => (
              <BookingCard key={booking.id} {...booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Нет завершённых бронирований</p>
            </div>
          )}
        </TabsContent>

        {/* Cancelled Bookings */}
        <TabsContent value="cancelled" className="space-y-3">
          {myBookings.cancelled.length > 0 ? (
            myBookings.cancelled.map((booking) => (
              <BookingCard key={booking.id} {...booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Нет отменённых бронирований</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
