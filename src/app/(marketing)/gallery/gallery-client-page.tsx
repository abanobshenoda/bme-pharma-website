"use client";
import { useLanguage } from "@/context/language-context";
import { FullGallery } from "@/components/gallery/full-gallery";
import type {
  GalleryImage,
  GalleryPage,
  GalleryCategory,
} from "@/generated/prisma/client";

interface GalleryClientPageProps {
  initialImages: GalleryImage[];
  pageDetails: GalleryPage | null;
  categories: GalleryCategory[];
}

export function GalleryClientPage({
  initialImages,
  pageDetails,
  categories,
}: GalleryClientPageProps) {
  const { language } = useLanguage();

  const title = pageDetails
    ? language === "ar"
      ? pageDetails.arabic_header
      : pageDetails.english_header
    : language === "ar"
      ? "معرض الصور"
      : "Media Gallery";

  const description = pageDetails
    ? language === "ar"
      ? pageDetails.arabic_description
      : pageDetails.english_description
    : language === "ar"
      ? "استكشف لحظاتنا، ومرافقنا، ومنتجاتنا من خلال عدسة الكاميرا."
      : "Explore our moments, facilities, and products through our lens.";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-muted py-12 md:py-16 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {description}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 flex-1 pb-16">
        <FullGallery initialImages={initialImages} categories={categories} />
      </main>
    </div>
  );
}
