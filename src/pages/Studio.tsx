import { Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "@/stores/settingsStore";

const Studio = () => {
  const { safeAreaTopInset, isFullscreen } = useSettingsStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 lg:pb-6 pt-6 px-4 lg:px-8 max-w-lg lg:max-w-4xl mx-auto" style={{ paddingTop: isFullscreen ? `calc(0.75rem + ${safeAreaTopInset}px)` : '2rem' }}>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-secondary/60"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Студия</h1>
          <p className="text-sm text-muted-foreground">Загружай работы и создавай услуги</p>
        </div>
      </div>

      <Tabs defaultValue="snippet" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="snippet">Загрузить отрывок</TabsTrigger>
          <TabsTrigger value="service">Создать услугу</TabsTrigger>
        </TabsList>

        {/* Upload Snippet */}
        <TabsContent value="snippet" className="space-y-5">
          <div className="bg-card border border-border border-dashed rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" strokeWidth={1.5} />
            <h3 className="font-semibold mb-1">Загрузи аудио или видео</h3>
            <p className="text-sm text-muted-foreground">MP3, WAV, MP4 (макс. 100 МБ)</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Название трека</label>
              <Input placeholder="Введи название трека..." className="bg-card" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Жанр</label>
              <Input placeholder="напр. Trap, EDM, Lo-Fi..." className="bg-card" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Теги</label>
              <Input placeholder="drill, dark, energy..." className="bg-card" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Описание</label>
              <Textarea
                placeholder="Расскажи о своём треке..."
                className="bg-card min-h-[120px]"
              />
            </div>

            <div className="bg-secondary/50 rounded-xl p-5">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                Встроенный редактор
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Обрежь фрагмент до 15–30 секунд после загрузки
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
                Редактор появится после загрузки файла
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-primary hover:shadow-neon transition-all h-12"
            >
              Загрузить в Feed
            </Button>
          </div>
        </TabsContent>

        {/* Create Service */}
        <TabsContent value="service" className="space-y-5">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Название услуги</label>
              <Input placeholder="напр. Кастомный Trap-бит" className="bg-card" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Что входит</label>
              <Textarea
                placeholder="Опиши, что получат клиенты..."
                className="bg-card min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Цена (₽)</label>
                <Input type="number" placeholder="15000" className="bg-card" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Срок выполнения</label>
                <Input placeholder="3 дня" className="bg-card" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Примеры работ</label>
              <div className="bg-card border border-border border-dashed rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Выбери из загруженных треков</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border" />
                <span className="text-sm">Привязать к последнему загруженному сниппету</span>
              </label>
            </div>

            <Button 
              className="w-full bg-gradient-accent hover:shadow-accent transition-all h-12"
            >
              Создать услугу
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Studio;
