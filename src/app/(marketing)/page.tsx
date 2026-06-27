import { HeroSection } from "@/components/marketing/hero-section";
import { CategoriesSection } from "@/components/marketing/categories-section";
import { FeaturedProductsSection } from "@/components/marketing/featured-products-section";
import { WhoWeAreSection } from "@/components/marketing/who-we-are-section";
import { GallerySection } from "@/components/marketing/gallery-section";
import { StatisticsSection } from "@/components/marketing/statistics-section";
import type { Product } from "@/types";
import { getHero } from "@/actions/homepage-actions";
import { getCategories } from "@/actions/category-actions";
import { getCategorySection } from "@/actions/category-section-actions";
import { getFeaturedProductsSection } from "@/actions/featured-products-section-actions";
import { getWhoWeAreSection } from "@/actions/who-we-are-section-actions";
import { getGallerySectionConfig } from "@/actions/gallery-section-actions";
import { getGalleryImages } from "@/actions/gallery-actions";
import { getStatisticsSection } from "@/actions/statistics-section-actions";
import { getFeaturedProducts } from "@/actions/store-actions";

export default async function Home() {
  const response = await getHero();
  const categories = await getCategories();
  const hero = response.success ? (response.data ?? null) : null;
  const categorySection = await getCategorySection();
  const featuredProductsSectionResponse = await getFeaturedProductsSection();
  const featuredProductsSectionData = featuredProductsSectionResponse.success
    ? (featuredProductsSectionResponse.data ?? null)
    : null;
  const whoWeAreSectionResponse = await getWhoWeAreSection();
  const whoWeAreSectionData = whoWeAreSectionResponse.success
    ? (whoWeAreSectionResponse.data ?? null)
    : null;
  const gallerySectionConfigResponse = await getGallerySectionConfig();
  const gallerySectionConfigData = gallerySectionConfigResponse.success
    ? (gallerySectionConfigResponse.data ?? null)
    : null;
  const allGalleryImagesResponse = await getGalleryImages();
  const allGalleryImages = allGalleryImagesResponse.success
    ? (allGalleryImagesResponse.data ?? [])
    : [];
  const selectedGalleryImages =
    gallerySectionConfigData && gallerySectionConfigData.selectedImageIds.length > 0
      ? allGalleryImages.filter((img) =>
          gallerySectionConfigData.selectedImageIds.includes(img.id),
        )
      : allGalleryImages.slice(0, 6);
  const statisticsSectionResponse = await getStatisticsSection();
  const statisticsSectionData = statisticsSectionResponse.success
    ? (statisticsSectionResponse.data ?? null)
    : null;

  // Fetch real featured products from DB
  const featuredProductsRes = await getFeaturedProducts();
  const featuredProducts: Product[] =
    featuredProductsRes.success && featuredProductsRes.data
      ? featuredProductsRes.data.map((p) => ({
          id: p.id.toString(),
          name: {
            en: p.english_name,
            ar: p.arabic_name || p.english_name,
          },
          price: p.price || 0,
          currency: p.currency as any,
          discount: p.discount || 0,
          image: p.image || "/placeholder-product.png",
          images: p.images || [],
          category: (p as any).category?.english_name || "",
          description: {
            en: p.english_description || "",
            ar: p.arabic_description || "",
          },
          sku: p.sku || undefined,
          stock: p.stock ?? 0,
          rating: p.rating ?? 0,
          reviews: p.reviews ?? 0,
        }))
      : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection hero={hero} />
        <CategoriesSection
          categories={categories.data ?? []}
          categorySection={categorySection.data ?? null}
        />
        <FeaturedProductsSection
          products={featuredProducts}
          featuredProductsSection={featuredProductsSectionData}
        />

        {/* Who We Are Section */}
        <WhoWeAreSection whoWeAreSection={whoWeAreSectionData} />

        {/* Gallery Section */}
        <GallerySection
          gallerySectionConfig={gallerySectionConfigData}
          selectedImages={selectedGalleryImages}
        />

        {/* Statistics Section */}
        <StatisticsSection statisticsSection={statisticsSectionData} />
      </main>
    </div>
  );
}
