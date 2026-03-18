import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Users, Clock, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { StudioGallery } from "@/components/studios/StudioGallery";
import { StudioBookingCard } from "@/components/studios/StudioBookingCard";
import { StudioEquipmentList } from "@/components/studios/StudioEquipmentList";
import { StudioMap } from "@/components/studios/StudioMap";
import { StudioReviews } from "@/components/studios/StudioReviews";
import { SimilarStudios } from "@/components/studios/SimilarStudios";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const StudioDetail = () => {
  const { id } = useParams();
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock data - in real app would fetch by ID
  const studio = {
    id: Number(id),
    name: "Studio Flow",
    type: ["with_equipment", "hourly", "daily"],
    pricePerHour: 2000,
    pricePerDay: 15000,
    location: "Москва, ЦАО, ул. Тверская, 15",
    district: "Центр",
    rating: 4.9,
    reviewsCount: 127,
    bookings: 342,
    photos: [
      "/images/studios/studio-flow-1.jpg",
      "/images/studios/studio-flow-2.jpg",
      "/images/studios/studio-flow-3.jpg",
      "/images/studios/studio-flow-4.jpg",
      "/images/studios/studio-flow-2.jpg"
    ],
    equipment: [
      { category: "Микрофоны", items: ["Neumann U87 Ai", "Shure SM7B", "AKG C414"] },
      { category: "Мониторы", items: ["Yamaha HS8", "Adam A7X"] },
      { category: "Интерфейсы", items: ["Universal Audio Apollo Twin", "Focusrite Clarett 8Pre"] },
      { category: "Обработка", items: ["SSL G-Series Bus Compressor", "1176 Compressor"] }
    ],
    description: "Профессиональная студия звукозаписи в самом центре Москвы. Мы предлагаем полный цикл работы с вашей музыкой: от записи вокала и инструментов до сведения и мастеринга. Студия оборудована по последнему слову техники, акустическая обработка помещения выполнена профессионалами. В нашей студии записывались такие исполнители как Элджей, Скриптонит и многие другие. Мы работаем в любых жанрах: от рэпа до рока. Возможна аренда как с звукорежиссёром, так и самостоятельная работа.",
    characteristics: {
      area: "45 м²",
      workingHours: "10:00 - 23:00",
      amenities: ["WiFi", "Кухня", "Парковка", "Кондиционер", "Комната отдыха"]
    },
    coordinates: [55.7558, 37.6173] as [number, number], // Тверская улица
    reviews: [
      {
        id: 1,
        author: "Алексей М.",
        rating: 5,
        date: "15 марта 2024",
        text: "Отличная студия! Записывались с группой, всё прошло на высшем уровне. Оборудование топовое, звукорежиссёр профессионал.",
        photos: []
      },
      {
        id: 2,
        author: "Мария К.",
        rating: 5,
        date: "8 марта 2024",
        text: "Записала свой первый трек именно здесь. Очень понравилась атмосфера и отношение персонала. Рекомендую!",
        photos: []
      }
    ],
    gradient: "bg-gradient-to-br from-violet-600 to-indigo-600",
    requiresPrepayment: true,
    prepaymentPercent: 50
  };

  return (
    <div className="min-h-screen pb-24 bg-background" style={{ paddingTop: isFullscreen ? `${safeAreaTopInset}px` : '0' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/studios">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:scale-110 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <StudioGallery photos={studio.photos} name={studio.name} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Info */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{studio.name}</h1>
              
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-semibold">{studio.rating}</span>
                  <span className="text-muted-foreground">({studio.reviewsCount} отзывов)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{studio.bookings} бронирований</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span>{studio.location}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">С аппаратурой</Badge>
                <Badge variant="outline">Почасовая аренда</Badge>
                <Badge variant="outline">Посуточная аренда</Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Описание</h2>
              <p className={`text-muted-foreground leading-relaxed ${!showFullDescription && 'line-clamp-4'}`}>
                {studio.description}
              </p>
              {studio.description.length > 200 && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-2"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? 'Скрыть' : 'Показать полностью'}
                </Button>
              )}
            </div>

            <Separator />

            {/* Equipment */}
            <StudioEquipmentList equipment={studio.equipment} />

            <Separator />

            {/* Characteristics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium">Площадь</p>
                    <p className="text-sm text-muted-foreground">{studio.characteristics.area}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium">Время работы</p>
                    <p className="text-sm text-muted-foreground">{studio.characteristics.workingHours}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium mb-2">Удобства:</p>
                <div className="flex flex-wrap gap-2">
                  {studio.characteristics.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Map */}
            <StudioMap coordinates={studio.coordinates} location={studio.location} name={studio.name} />

            <Separator />

            {/* Reviews */}
            <StudioReviews reviews={studio.reviews} rating={studio.rating} reviewsCount={studio.reviewsCount} />
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <StudioBookingCard
                studioName={studio.name}
                ownerUsername="studio_owner"
                pricePerHour={studio.pricePerHour}
                pricePerDay={studio.pricePerDay}
                rating={studio.rating}
                reviewsCount={studio.reviewsCount}
                requiresPrepayment={studio.requiresPrepayment}
                prepaymentPercent={studio.prepaymentPercent}
              />
            </div>
          </div>
        </div>

        {/* Similar Studios */}
        <div className="mt-12">
          <SimilarStudios currentStudioId={studio.id} />
        </div>
      </div>

      {/* Mobile Sticky Booking Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold">{studio.pricePerHour} ₽<span className="text-sm font-normal text-muted-foreground">/час</span></p>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span>{studio.rating}</span>
            </div>
          </div>
          <Button className="flex-1 bg-gradient-primary hover:shadow-neon">
            Забронировать
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;
