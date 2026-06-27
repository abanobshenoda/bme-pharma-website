"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./product-card";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { FeaturedProductsSection as FeaturedProductsSectionType } from "@/generated/prisma/client";

interface FeaturedProductsSectionProps {
  products: Product[];
  featuredProductsSection?: FeaturedProductsSectionType | null;
}

export function FeaturedProductsSection({
  products,
  featuredProductsSection,
}: FeaturedProductsSectionProps) {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Get header and description from database or fall back to translations
  const header = featuredProductsSection
    ? language === "ar"
      ? featuredProductsSection.arabic_header
      : featuredProductsSection.english_header
    : null;

  const description = featuredProductsSection
    ? language === "ar"
      ? featuredProductsSection.arabic_description
      : featuredProductsSection.english_description
    : null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-10 ">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
              {header || t("section.featured")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {description || t("section.featuredDesc")}
            </p>
          </div>

          <Button variant="outline" asChild className="hidden md:flex group">
            <Link href="/products">
              {t("btn.viewAll")}
              <ArrowIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild className="w-full group">
            <Link href="/store">
              {t("btn.viewAll")}
              <ArrowIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
