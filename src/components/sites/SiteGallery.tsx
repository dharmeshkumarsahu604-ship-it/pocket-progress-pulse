import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface SiteImage {
  url: string;
  caption: string;
  type: string;
  season?: string;
}

interface SiteGalleryProps {
  images: SiteImage[];
  siteName: string;
}

export function SiteGallery({ images, siteName }: SiteGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<SiteImage | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Photo Gallery</h3>
          <Badge variant="secondary">{images.length} Photos</Badge>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className="cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                >
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                  </AspectRatio>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {image.caption}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {image.type}
                      </Badge>
                      {image.season && (
                        <Badge variant="outline" className="text-xs">
                          {image.season}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full h-auto rounded-lg"
              />
              <div>
                <h4 className="font-semibold text-lg">{selectedImage.caption}</h4>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{selectedImage.type}</Badge>
                  {selectedImage.season && (
                    <Badge variant="secondary">{selectedImage.season}</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
