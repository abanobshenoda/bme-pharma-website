"use client";

import { useLanguage } from "@/context/language-context";
import { ProductGrid } from "@/components/store/product-grid";
import { StoreHeader } from "@/components/store/store-header";
import { useState, useMemo } from "react";
import type {
  Product,
  Category,
  ProductsPage,
} from "@/generated/prisma/client";

interface ProductsClientPageProps {
  initialProducts: (Product & { category: Category })[];
  pageDetails: ProductsPage | null;
}

export function ProductsClientPage({
  initialProducts,
  pageDetails,
}: ProductsClientPageProps) {
  const { language } = useLanguage();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("featured");

  const title = pageDetails
    ? language === "ar"
      ? pageDetails.arabic_header
      : pageDetails.english_header
    : language === "ar"
      ? "منتجاتنا"
      : "Our Products";

  const description = pageDetails
    ? language === "ar"
      ? pageDetails.arabic_description
      : pageDetails.english_description
    : language === "ar"
      ? "استكشف خط منتجاتنا الواسع من الحلول الطبية المبتكرة."
      : "Explore our extensive product line of innovative medical solutions.";

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Sort
    if (sortOption === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortOption === "featured") {
      result.sort((a, b) =>
        a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1,
      );
    }

    return result;
  }, [sortOption, initialProducts]);

  const mappedProducts = filteredProducts.map((p) => ({
    id: p.id.toString(),
    name: { en: p.english_name, ar: p.arabic_name || p.english_name },
    price: p.price || 0,
    image: p.image || "/placeholder-product.png",
    category: p.category.english_name,
    description: {
      en: p.english_description || "",
      ar: p.arabic_description || "",
    },
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <StoreHeader
          totalProducts={mappedProducts.length}
          sortOption={sortOption}
          setSortOption={setSortOption}
          layout={layout}
          setLayout={setLayout}
        />

        <div className="mt-8">
          {mappedProducts.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
              <p className="text-muted-foreground">
                Coming soon! We are updating our product list.
              </p>
            </div>
          ) : (
            <ProductGrid products={mappedProducts as any} layout={layout} />
          )}
        </div>
      </div>
    </div>
  );
}
