import { useParams, Navigate } from "react-router-dom";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { ProfileServiceCard } from "@/components/profile/ProfileServiceCard";
import { SnippetGridItem } from "@/components/profile/SnippetGridItem";
import { StudioCard } from "@/components/studios/StudioCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "sonner";

// Mock data for different users
const mockUsers: Record<string, any> = {
  producer_alex: {
    username: "producer_alex",
    displayName: "Alex Beats",
    bio: "Продюсер | Hip-Hop & Trap | 10+ лет опыта | Сотрудничал с топовыми артистами 🔥",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    coverGradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600",
    stats: { followers: 12500, following: 340, tracks: 156, rating: 4.9, ordersCompleted: 234 },
    badges: [
      { label: "Verified", variant: "verified" as const },
      { label: "Top Creator", variant: "top" as const },
    ],
    mutualFollowers: [
      { id: "1", username: "user1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1" },
      { id: "2", username: "user2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User2" },
      { id: "3", username: "user3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User3" },
    ],
    mutualFollowersCount: 12,
    socialLinks: { instagram: "https://instagram.com", twitter: "https://twitter.com", telegram: "https://t.me" },
  },
  singer_maria: {
    username: "singer_maria",
    displayName: "Maria Voice",
    bio: "Вокалистка | R&B, Soul, Pop | Запишу вокал для вашего трека ✨",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    coverGradient: "bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600",
    stats: { followers: 8200, following: 890, tracks: 89, rating: 4.8, ordersCompleted: 156 },
    badges: [{ label: "Verified", variant: "verified" as const }],
    mutualFollowers: [{ id: "1", username: "user1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1" }],
    mutualFollowersCount: 5,
    socialLinks: { instagram: "https://instagram.com" },
  },
  engineer_mike: {
    username: "engineer_mike",
    displayName: "Mike Sound",
    bio: "Звукорежиссер | Mixing & Mastering | Работал с Grammy-nominated артистами 🎚️",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    coverGradient: "bg-gradient-to-br from-orange-600 via-red-600 to-pink-600",
    stats: { followers: 15300, following: 120, tracks: 203, rating: 5.0, ordersCompleted: 567 },
    badges: [
      { label: "Verified", variant: "verified" as const },
      { label: "Top Creator", variant: "top" as const },
      { label: "Pro", variant: "pro" as const },
    ],
    mutualFollowers: [],
    mutualFollowersCount: 0,
    socialLinks: { instagram: "https://instagram.com", twitter: "https://twitter.com", telegram: "https://t.me" },
  },
  trapmaster: {
    username: "trapmaster",
    displayName: "Trap Master",
    bio: "Король trap битов | Более 500 продаж | Работал с топовыми рэперами 🎵",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TrapMaster",
    coverGradient: "bg-gradient-to-br from-purple-600 to-pink-600",
    stats: { followers: 18700, following: 230, tracks: 234, rating: 4.9, ordersCompleted: 567 },
    badges: [
      { label: "Verified", variant: "verified" as const },
      { label: "Top Creator", variant: "top" as const },
    ],
    mutualFollowers: [
      { id: "1", username: "user1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User1" },
      { id: "2", username: "user2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User2" },
    ],
    mutualFollowersCount: 8,
    socialLinks: { instagram: "https://instagram.com", telegram: "https://t.me" },
  },
  beatmaster: {
    username: "beatmaster",
    displayName: "Beat Master",
    bio: "EDM Producer | Создаю взрывные биты уже 8 лет 💥",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BeatMaster",
    coverGradient: "bg-gradient-to-br from-cyan-600 to-blue-600",
    stats: { followers: 14200, following: 450, tracks: 189, rating: 5.0, ordersCompleted: 345 },
    badges: [{ label: "Verified", variant: "verified" as const }],
    mutualFollowersCount: 3,
    socialLinks: { twitter: "https://twitter.com", telegram: "https://t.me" },
  },
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();

  // If username matches current user, redirect to own profile
  // TODO: Replace with actual current user check
  if (username === "currentuser") {
    return <Navigate to="/profile" replace />;
  }

  // Get user data
  const user = username ? mockUsers[username as keyof typeof mockUsers] : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Пользователь не найден</h1>
          <p className="text-muted-foreground">@{username}</p>
        </div>
      </div>
    );
  }

  const handleFollowToggle = () => {
    toast.success("Функция подписки будет доступна после интеграции с бэкендом");
  };

  const handleMessage = () => {
    toast.info("Функция сообщений будет доступна скоро");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Ссылка скопирована в буфер обмена");
  };

  // Mock services
  const services = [
    { title: "Продакшн трека под ключ", price: 15000, views: 2500, ordersCompleted: 45 },
    { title: "Mixing & Mastering", price: 8000, views: 1800, ordersCompleted: 89 },
    { title: "Запись вокала", price: 5000, views: 3200, ordersCompleted: 123 },
  ];

  // Mock snippets
  const snippets = [
    { title: "Dark Trap Beat", genre: "Trap", gradient: "bg-gradient-to-br from-purple-600 to-pink-600" },
    { title: "Chill Lo-Fi", genre: "Lo-Fi", gradient: "bg-gradient-to-br from-blue-600 to-cyan-600" },
    { title: "Hard Drill", genre: "Drill", gradient: "bg-gradient-to-br from-red-600 to-orange-600" },
    { title: "Summer Vibes", genre: "Pop", gradient: "bg-gradient-to-br from-yellow-600 to-orange-600" },
  ];

  // Mock studios
  const studios = [
    {
      id: 1,
      name: "Pro Studio A",
      type: ["full_service", "with_equipment", "hourly"],
      pricePerHour: 3000,
      location: "Москва, Центр",
      rating: 4.9,
      bookings: 156,
      equipment: "SSL Console, Neumann U87, Pro Tools HD, Focal monitors, полный комплект для записи и сведения",
      description: "Профессиональная студия с полным циклом производства музыки. SSL консоль, топовые микрофоны и оборудование.",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-600",
    },
  ];

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        paddingTop: isFullscreen ? `${safeAreaTopInset}px` : "0px",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 md:px-4 md:py-6">
        {/* User Profile Card */}
        <UserProfileCard
          {...user}
          onFollowToggle={handleFollowToggle}
          onMessage={handleMessage}
          onShare={handleShare}
        />

        {/* Content Tabs */}
        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mx-3 md:mx-0" style={{ width: 'calc(100% - 24px)' }}>
            <TabsTrigger value="tracks" className="text-xs md:text-sm">Треки</TabsTrigger>
            <TabsTrigger value="services" className="text-xs md:text-sm">Услуги</TabsTrigger>
            <TabsTrigger value="studios" className="text-xs md:text-sm">Студии</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4 mt-4 px-3 md:px-0 md:mt-6">
            <div className="grid grid-cols-2 gap-3">
              {snippets.map((snippet, index) => (
                <SnippetGridItem key={index} {...snippet} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-3 mt-4 px-3 md:px-0 md:mt-6">
            {services.map((service, index) => (
              <ProfileServiceCard key={index} {...service} />
            ))}
          </TabsContent>

          <TabsContent value="studios" className="space-y-4 mt-4 px-3 md:px-0 md:mt-6">
            {studios.map((studio) => (
              <StudioCard key={studio.id} {...studio} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
