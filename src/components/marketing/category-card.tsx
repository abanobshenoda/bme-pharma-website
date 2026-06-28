"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
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
      <div className="relative h-full min-h-[180px] overflow-hidden rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group-hover:-translate-y-2">
        <Image
          src={category.image}
          alt={getName({
            en: category.english_name ?? "",
            ar: category.arabic_name ?? "",
          })}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Always-visible gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Category info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-base text-white leading-tight mb-0.5 drop-shadow">
            {getName({
              en: category.english_name ?? "",
              ar: category.arabic_name ?? "",
            })}
          </h3>
          {category.products.length !== undefined && (
            <p className="text-xs text-white/80">
              {category.products.length}{" "}
              {language === "ar" ? "منتج" : "Products"}
            </p>
          )}
        </div>
        {/* Arrow icon on hover */}
        <div className="absolute top-3 end-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowIcon className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
