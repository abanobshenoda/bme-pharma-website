"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { StoreFilters } from "@/components/store/store-filters";
import { StoreHeader } from "@/components/store/store-header";
import { ProductGrid } from "@/components/store/product-grid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { Product, Category, StorePage } from "@/generated/prisma/client";
import type { Currency } from "@/types";

type ProductWithCategories = Omit<Product, "categoryId"> & {
  categories: Category[];
};

interface StoreClientPageProps {
  initialProducts: ProductWithCategories[];
  categories: Category[];
  pageDetails: StorePage | null;
}

export function StoreClientPage({
  initialProducts,
  categories,
  pageDetails,
}: StoreClientPageProps) {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Resolve category name/ID from URL parameter
  const resolvedCategory = useMemo(() => {
    const param = searchParams.get("category") || "all";
    if (param === "all") return "all";

    // If it's a numeric ID, return it directly
    if (/^\d+$/.test(param)) {
      return param;
    }

    // Find category by name (case-insensitive)
    const matchedCat = categories.find(
      (c) => c.english_name && c.english_name.toLowerCase() === param.toLowerCase()
    );
    return matchedCat ? matchedCat.id.toString() : "all";
  }, [searchParams, categories]);

  // State
  const [selectedCategory, setSelectedCategory] = useState(resolvedCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState("featured");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const searchQuery = searchParams.get("search") || "";

  const title = pageDetails
    ? language === "ar"
      ? pageDetails.arabic_header
      : pageDetails.english_header
    : language === "ar"
      ? "المتجر"
      : "Store";

  const description = pageDetails
    ? language === "ar"
      ? pageDetails.arabic_description
      : pageDetails.english_description
    : language === "ar"
      ? "تصفح مجموعتنا الواسعة من المنتجات الطبية عالية الجودة."
      : "Browse our wide range of high-quality medical products.";

  // Sync state with URL manually when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      // Find category name to keep the URL human-readable
      const cat = categories.find((c) => c.id.toString() === category);
      if (cat && cat.english_name) {
        params.set("category", cat.english_name);
      } else {
        params.set("category", category);
      }
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Sync URL to state
  useEffect(() => {
    setSelectedCategory(resolvedCategory);
  }, [resolvedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) =>
        p.categories.some((c) => c.id.toString() === selectedCategory),
      );
    }

    // Filter by Price
    result = result.filter(
      (p) => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1],
    );

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.english_name.toLowerCase().includes(q) ||
          (p.arabic_name && p.arabic_name.toLowerCase().includes(q)) ||
          (p.english_description &&
            p.english_description.toLowerCase().includes(q)) ||
          (p.arabic_description &&
            p.arabic_description.toLowerCase().includes(q)),
      );
    }

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
  }, [selectedCategory, priceRange, sortOption, searchQuery, initialProducts]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Map products to the type expected by ProductGrid if necessary,
  // but I'll assume I'll update ProductGrid as well or map here.
  const mappedProducts = currentProducts.map((p) => ({
    id: p.id.toString(),
    name: { en: p.english_name, ar: p.arabic_name || p.english_name },
    price: p.price || 0,
    currency: p.currency as Currency,
    discount: p.discount || 0,
    discountType: p.discountType as "PERCENTAGE" | "BUY_X_GET_Y",
    buyXQuantity: p.buyXQuantity ?? undefined,
    getYQuantity: p.getYQuantity ?? undefined,
    image: p.image || "/placeholder-product.png",
    images: p.images || [],
    category: p.categories.map((c) => c.english_name).join(", "),
    description: {
      en: p.english_description || "",
      ar: p.arabic_description || "",
    },
    sku: p.sku || undefined,
    stock: p.stock ?? 0,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
  }));

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, sortOption]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-muted py-8 mb-8">
        <div className="container mx-auto px-10 ">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
      </div>

      <div className="container mx-auto px-10 flex-1 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
            <StoreFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={0}
              maxPrice={1000}
              categories={categories}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Filter className="w-4 h-4" />
                    {t("store.filters") ||
                      (language === "ar"
                        ? "تصفية المنتجات"
                        : "Filter Products")}
                  </Button>
                </SheetTrigger>
                <SheetContent side={language === "ar" ? "right" : "left"}>
                  <div className="py-6 px-4">
                    <StoreFilters
                      selectedCategory={selectedCategory}
                      setSelectedCategory={handleCategoryChange}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      minPrice={0}
                      maxPrice={1000}
                      categories={categories}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <StoreHeader
              totalProducts={filteredProducts.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
              layout={layout}
              setLayout={setLayout}
            />

            {mappedProducts.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">
                  No products found for the selected criteria.
                </p>
              </div>
            ) : (
              <ProductGrid
                products={
                  mappedProducts as unknown as import("@/types").Product[]
                }
                layout={layout}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage((p) => p - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage((p) => p + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
