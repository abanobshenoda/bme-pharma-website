"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";
import type {
  GallerySectionConfig,
  GalleryImage,
} from "@/generated/prisma/client";

type GallerySectionProps = {
  gallerySectionConfig?: GallerySectionConfig | null;
  selectedImages?: GalleryImage[];
};

// Default fallback images
const defaultImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=800&auto=format&fit=crop",
    alt: "Laboratory Research",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1576091160550-21733e99dbb9?q=80&w=800&auto=format&fit=crop",
    alt: "Quality Control",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop",
    alt: "Global Distribution",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    alt: "Pharmaceutical Products",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1556228720-19875c4b223d?q=80&w=800&auto=format&fit=crop",
    alt: "Customer Care",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1556228578-8d8442c55e41?q=80&w=800&auto=format&fit=crop",
    alt: "Expert Team",
  },
];

export const GallerySection = ({
  gallerySectionConfig,
  selectedImages,
}: GallerySectionProps) => {
  const { language } = useLanguage();

  const header = gallerySectionConfig
    ? language === "ar"
      ? gallerySectionConfig.arabic_header
      : gallerySectionConfig.english_header
    : language === "ar"
      ? "معرض الصور"
      : "Our Gallery";

  const description = gallerySectionConfig
    ? language === "ar"
      ? gallerySectionConfig.arabic_description
      : gallerySectionConfig.english_description
    : language === "ar"
      ? "إلق نظرة على مرافقنا ومنتجاتنا وفريقنا وهو يعمل."
      : "Take a look at our facilities, products, and our team in action.";

  const images =
    selectedImages && selectedImages.length > 0
      ? selectedImages.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || "Gallery image",
        }))
      : defaultImages;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-10 ">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            {header || (language === "ar" ? "معرض الصور" : "Our Gallery")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {description ||
              (language === "ar"
                ? "إلق نظرة على مرافقنا ومنتجاتنا وفريقنا وهو يعمل."
                : "Take a look at our facilities, products, and our team in action.")}
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image) => (
            <div key={image.id} className="break-inside-avoid">
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="group relative overflow-hidden rounded-xl cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${image.alt}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 p-3 rounded-full text-primary shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/gallery">
              {language === "ar" ? "عرض المزيد" : "Show More"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
