import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settingsStore";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trackName: string;
  username: string;
}

export const ShareSheet = ({ isOpen, onClose, trackName, username }: ShareSheetProps) => {
  const shareUrl = `${window.location.origin}/feed?track=${encodeURIComponent(trackName)}`;
  const { safeAreaTopInset } = useSettingsStore();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на трек скопирована в буфер обмена",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку",
        variant: "destructive",
      });
    }
  };

  const handleShareTelegram = () => {
    const text = `Послушай трек "${trackName}" от @${username}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  const handleShareVK = () => {
    const text = `Послушай трек "${trackName}" от @${username}`;
    window.open(`https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  const handleShareWhatsApp = () => {
    const text = `Послушай трек "${trackName}" от @${username} ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto p-0 rounded-t-3xl border-0">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-4 pb-4">
          <SheetTitle className="text-center text-base font-semibold">Поделиться</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6">
          <div className="grid grid-cols-4 gap-4">
            <button
              className="flex flex-col items-center gap-2 transition-transform active:scale-95"
              onClick={handleShareTelegram}
            >
              <div className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              <span className="text-[11px] font-medium">Telegram</span>
            </button>

            <button
              className="flex flex-col items-center gap-2 transition-transform active:scale-95"
              onClick={handleShareVK}
            >
              <div className="w-14 h-14 rounded-full bg-[#0077FF] flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 192 192" fill="white">
                  <path d="M162.9 118.3c-3.2-3.4-2.3-5 .9-8.1 0 0 16.4-23.1 18.1-30.9l.1-.2c.9-3.2.1-5.5-4.5-5.5h-15c-3.8 0-5.5 2-6.4 4.2 0 0-7.5 18.3-18.1 30.1-3.4 3.4-5 4.5-6.9 4.5-.9 0-2.3-1.1-2.3-4.3V73.9c0-3.8-1.1-5.5-4.2-5.5H99.1c-2.4 0-3.8 1.8-3.8 3.4 0 3.6 5.4 4.4 5.9 14.5v21.9c0 4.8-.9 5.7-2.7 5.7-5 0-17.2-18.4-24.4-39.5-1.4-4-2.8-5.6-6.7-5.6H52.5c-4.3 0-5.1 2-5.1 4.2 0 3.9 5 23.4 23.3 49.1 12.2 17.5 29.4 27 45.1 27 9.4 0 10.6-2.1 10.6-5.8V133c0-4.3.9-5.1 3.9-5.1 2.2 0 6 1.1 14.8 9.6 10.1 10.1 11.8 14.6 17.5 14.6h15c4.3 0 6.4-2.1 5.2-6.3-1.4-4.2-6.2-10.2-12.6-17.4-3.4-4-8.5-8.3-10-10.5-2.2-2.8-1.6-4.1 0-6.6z"/>
                </svg>
              </div>
              <span className="text-[11px] font-medium">VK</span>
            </button>

            <button
              className="flex flex-col items-center gap-2 transition-transform active:scale-95"
              onClick={handleShareWhatsApp}
            >
              <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <span className="text-[11px] font-medium">WhatsApp</span>
            </button>

            <button
              className="flex flex-col items-center gap-2 transition-transform active:scale-95"
              onClick={handleCopyLink}
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Copy className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-[11px] font-medium">Копировать</span>
            </button>
          </div>
        </div>

        <div className="pb-4" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }} />
      </SheetContent>
    </Sheet>
  );
};
