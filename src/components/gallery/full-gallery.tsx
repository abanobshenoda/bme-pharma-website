"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage, GalleryCategory } from "@/generated/prisma/client";

interface FullGalleryProps {
  initialImages: GalleryImage[];
  categories: GalleryCategory[];
}

export function FullGallery({ initialImages, categories }: FullGalleryProps) {
  const { language } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">(
    "all",
  );
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter Images
  const filteredImages = useMemo(() => {
    if (selectedCategoryId === "all") return initialImages;
    return initialImages.filter((img) => img.categoryId === selectedCategoryId);
  }, [selectedCategoryId, initialImages]);

  // Visible Images
  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  // Handlers
  const handleFilterChange = (categoryId: number | "all") => {
    setSelectedCategoryId(categoryId);
    setVisibleCount(6); // Reset visible count on filter change
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setIsLoadingMore(false);
    }, 500);
  };

  const hasMore = visibleCount < filteredImages.length;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <Button
          key="all"
          variant={selectedCategoryId === "all" ? "default" : "outline"}
          onClick={() => handleFilterChange("all")}
          className="rounded-full px-6"
        >
          {language === "ar" ? "الكل" : "All"}
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            onClick={() => handleFilterChange(category.id)}
            className="rounded-full px-6"
          >
            {language === "ar" ? category.arabic_name : category.english_name}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {visibleImages.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {visibleImages.map((image) => (
            <div
              key={`${image.url}-${image.id}`}
              className="break-inside-avoid"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="group relative overflow-hidden rounded-xl cursor-pointer bg-muted">
                    <Image
                      src={image.url}
                      alt={image.alt || "Gallery image"}
                      width={800}
                      height={600}
                      className={cn(
                        "w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110",
                        // Fallback aspect ratio if needed, but 'h-auto' preserves mostly
                      )}
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
                      alt={image.alt || "Gallery image"}
                      fill
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-xl">
          <p className="text-muted-foreground">
            {language === "ar"
              ? "لا توجد صور في هذا القسم."
              : "No images found in this category."}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="min-w-[150px]"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "ar" ? "جاري التحميل..." : "Loading..."}
              </>
            ) : language === "ar" ? (
              "تحميل المزيد"
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
