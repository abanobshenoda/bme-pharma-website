"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Category } from "@/generated/prisma/client";
import { Product } from "@/generated/prisma/browser";

interface CategoryCardProps {
  category: Category & { products: Product[] };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const getName = (name: { en: string; ar: string }) => {
    return language === "ar" ? name.ar : name.en;
  };

  return (
    <Link
      href={`/store?category=${category.id}`}
      className="group block h-full"
    >
      <Card className="h-full overflow-hidden rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 bg-card/80 backdrop-blur-sm group-hover:-translate-y-2">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          <Image
            src={category.image}
            alt={getName({
              en: category.english_name ?? "",
              ar: category.arabic_name ?? "",
            })}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {getName({
                  en: category.english_name ?? "",
                  ar: category.arabic_name ?? "",
                })}
              </h3>
              {category.products.length !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {category.products.length}{" "}
                  {language === "ar" ? "منتج" : "Products"}
                </p>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 rtl:-translate-x-2 rtl:group-hover:translate-x-0">
              <ArrowIcon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
