"use client";

import { useLanguage } from "@/context/language-context";
import { CategoryCard } from "./category-card";
import { Category, CategorySection } from "@/generated/prisma/client";
import { Product } from "@/generated/prisma/browser";

interface CategoriesSectionProps {
  categories: (Category & { products: Product[] })[];
  categorySection: CategorySection | null;
}

export function CategoriesSection({
  categories,
  categorySection,
}: CategoriesSectionProps) {
  const { language } = useLanguage();

  // Early return if no category section data
  if (!categorySection) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-10 ">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {language === "ar"
              ? categorySection.arabic_header
              : categorySection.english_header}
          </h2>
          <p className="text-muted-foreground text-lg">
            {language === "ar"
              ? categorySection.arabic_description
              : categorySection.english_description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
