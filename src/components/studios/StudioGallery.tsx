import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grid2x2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";

interface StudioGalleryProps {
  photos: string[];
  name: string;
}

export const StudioGallery = ({ photos, name }: StudioGalleryProps) => {
  const { safeAreaTopInset } = useSettingsStore();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (showAllPhotos && thumbnailRefs.current[currentPhotoIndex]) {
      thumbnailRefs.current[currentPhotoIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentPhotoIndex, showAllPhotos]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative group cursor-pointer" onClick={() => setShowAllPhotos(true)}>
        <div className="grid grid-cols-4 gap-2 h-[300px] md:h-[450px] overflow-hidden">
          {/* Main large photo */}
          <div className="col-span-4 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-l-xl md:rounded-l-2xl">
            <img 
              src={photos[0]} 
              alt={`${name} - основное фото`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          
          {/* Smaller photos grid */}
          {photos.slice(1, 5).map((photo, index) => (
            <div 
              key={index} 
              className={`col-span-2 md:col-span-1 relative overflow-hidden ${
                index === 3 ? 'rounded-r-xl md:rounded-r-2xl' : ''
              }`}
            >
              <img 
                src={photo} 
                alt={`${name} - фото ${index + 2}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {index === 3 && photos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{photos.length - 5} фото</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show All Photos Button */}
        <Button 
          variant="secondary"
          className="absolute bottom-4 right-4 gap-2 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setShowAllPhotos(true);
          }}
        >
          <Grid2x2 className="w-4 h-4" />
          Показать все фото
        </Button>
      </div>

      {/* Full Screen Gallery Dialog */}
      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="w-[100vw] max-w-[100vw] h-auto max-h-[100vh] p-0 gap-0 border-0 rounded-none" hideClose>
          <div className="flex flex-col items-center bg-black w-full overflow-hidden">
            <div className="relative w-full flex items-center justify-center">
              {/* Custom Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
                style={{ top: `${safeAreaTopInset + 8}px` }}
                onClick={() => setShowAllPhotos(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>

              {/* Current Photo */}
              <img 
                src={photos[currentPhotoIndex]} 
                alt={`${name} - фото ${currentPhotoIndex + 1}`}
                className="w-full max-h-[75vh] object-contain"
              />
              
              {/* Photo Counter for Mobile */}
              <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {currentPhotoIndex + 1} / {photos.length}
              </div>

              {/* Navigation */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                    onClick={prevPhoto}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                    onClick={nextPhoto}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>

            {/* Photo Counter */}
            <div className="hidden md:block bg-black/70 text-white px-4 py-2 text-sm mt-4">
              {currentPhotoIndex + 1} / {photos.length}
            </div>

            {/* Thumbnails */}
            <div className="w-full overflow-x-auto px-4 py-4 bg-black">
              <div className="flex gap-2 justify-start min-w-min pr-4">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    ref={(el) => (thumbnailRefs.current[index] = el)}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      index === currentPhotoIndex 
                        ? 'border-primary scale-110' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={photo} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
