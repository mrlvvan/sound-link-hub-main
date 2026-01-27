import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "@/components/orders/OrderCard";
import { useSettingsStore } from "@/stores/settingsStore";

const Orders = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const myOrders = {
    active: [
      {
        id: 1,
        service: "Trap бит production",
        provider: "trapmaster",
        status: "in_progress" as const,
        deadline: "Осталось 2 дня",
        price: 15000,
        createdAt: "15 окт 2025",
      },
      {
        id: 2,
        service: "Сведение и мастеринг",
        provider: "mixpro",
        status: "review" as const,
        deadline: "Готово к проверке",
        price: 8000,
        createdAt: "12 окт 2025",
      },
      {
        id: 3,
        service: "Drill бит с вокалом",
        provider: "drillking",
        status: "pending" as const,
        deadline: "Ожидает начала",
        price: 18000,
        createdAt: "14 окт 2025",
      },
    ],
    completed: [
      {
        id: 4,
        service: "EDM трек production",
        provider: "edm_master",
        status: "completed" as const,
        deadline: "Завершено",
        price: 20000,
        createdAt: "5 окт 2025",
      },
      {
        id: 5,
        service: "Вокал под ключ",
        provider: "vocal_pro",
        status: "completed" as const,
        deadline: "Завершено",
        price: 12000,
        createdAt: "1 окт 2025",
      },
    ],
    drafts: [
      {
        id: 6,
        service: "Аранжировка трека",
        provider: "arranger_pro",
        status: "cancelled" as const,
        deadline: "Отменён",
        price: 10000,
        createdAt: "10 окт 2025",
      },
    ],
  };

  const myServices = {
    active: [
      {
        id: 1,
        service: "Кастомный Trap бит",
        client: "rapper_jay",
        status: "in_progress" as const,
        deadline: "Осталось 3 дня",
        price: 20000,
        createdAt: "13 окт 2025",
      },
      {
        id: 2,
        service: "Сведение вокала",
        client: "singer_anna",
        status: "pending" as const,
        deadline: "Ожидает начала",
        price: 10000,
        createdAt: "14 окт 2025",
      },
    ],
    completed: [
      {
        id: 3,
        service: "Drill бит production",
        client: "artist_mike",
        status: "completed" as const,
        deadline: "Завершено",
        price: 15000,
        createdAt: "7 окт 2025",
      },
      {
        id: 4,
        service: "Мастеринг альбома",
        client: "band_crew",
        status: "completed" as const,
        deadline: "Завершено",
        price: 25000,
        createdAt: "3 окт 2025",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-7xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      <h1 className="text-3xl font-bold mb-6">Заказы</h1>

      <Tabs defaultValue="client" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="client">Мои заказы</TabsTrigger>
          <TabsTrigger value="provider">Мои услуги</TabsTrigger>
        </TabsList>

        {/* Client Orders */}
        <TabsContent value="client" className="space-y-6">
          {/* Active Orders */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
              Активные ({myOrders.active.length})
            </h2>
            <div className="space-y-3">
              {myOrders.active.map((order) => (
                <OrderCard
                  key={order.id}
                  id={order.id}
                  service={order.service}
                  username={order.provider}
                  status={order.status}
                  deadline={order.deadline}
                  price={order.price}
                  createdAt={order.createdAt}
                  isClient={true}
                />
              ))}
            </div>
          </section>

          {/* Completed Orders */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
              Завершённые ({myOrders.completed.length})
            </h2>
            <div className="space-y-3">
              {myOrders.completed.map((order) => (
                <OrderCard
                  key={order.id}
                  id={order.id}
                  service={order.service}
                  username={order.provider}
                  status={order.status}
                  deadline={order.deadline}
                  price={order.price}
                  createdAt={order.createdAt}
                  isClient={true}
                />
              ))}
            </div>
          </section>

          {/* Drafts/Cancelled */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
              Черновики ({myOrders.drafts.length})
            </h2>
            <div className="space-y-3">
              {myOrders.drafts.map((order) => (
                <OrderCard
                  key={order.id}
                  id={order.id}
                  service={order.service}
                  username={order.provider}
                  status={order.status}
                  deadline={order.deadline}
                  price={order.price}
                  createdAt={order.createdAt}
                  isClient={true}
                />
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Provider Services */}
        <TabsContent value="provider" className="space-y-6">
          {/* Active Services */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
              Активные ({myServices.active.length})
            </h2>
            <div className="space-y-3">
              {myServices.active.map((service) => (
                <OrderCard
                  key={service.id}
                  id={service.id}
                  service={service.service}
                  username={service.client}
                  status={service.status}
                  deadline={service.deadline}
                  price={service.price}
                  createdAt={service.createdAt}
                  isClient={false}
                />
              ))}
            </div>
          </section>

          {/* Completed Services */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
              Завершённые ({myServices.completed.length})
            </h2>
            <div className="space-y-3">
              {myServices.completed.map((service) => (
                <OrderCard
                  key={service.id}
                  id={service.id}
                  service={service.service}
                  username={service.client}
                  status={service.status}
                  deadline={service.deadline}
                  price={service.price}
                  createdAt={service.createdAt}
                  isClient={false}
                />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
