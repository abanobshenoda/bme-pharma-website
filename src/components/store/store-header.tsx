"use client";

import { useLanguage } from "@/context/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface StoreHeaderProps {
  totalProducts: number;
  sortOption: string;
  setSortOption: (option: string) => void;
  layout: "grid" | "list";
  setLayout: (layout: "grid" | "list") => void;
}

export function StoreHeader({
  totalProducts,
  sortOption,
  setSortOption,
  layout,
  setLayout,
}: StoreHeaderProps) {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="text-sm text-muted-foreground">
        {t("store.showing") || (language === "ar" ? "عرض" : "Showing")}{" "}
        <span className="font-medium text-foreground">{totalProducts}</span>{" "}
        {t("store.results") || (language === "ar" ? "نتائج" : "results")}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <label className="text-sm whitespace-nowrap hidden sm:block">
            {t("store.sortBy") ||
              (language === "ar" ? "ترتيب حسب:" : "Sort by:")}
          </label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">
                {language === "ar" ? "المميزة" : "Featured"}
              </SelectItem>
              <SelectItem value="newest">
                {language === "ar" ? "الأحدث" : "Newest Arrivals"}
              </SelectItem>
              <SelectItem value="price-asc">
                {language === "ar"
                  ? "السعر: من الأقل للأعلى"
                  : "Price: Low to High"}
              </SelectItem>
              <SelectItem value="price-desc">
                {language === "ar"
                  ? "السعر: من الأعلى للأقل"
                  : "Price: High to Low"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center border rounded-md bg-background ml-auto sm:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none rounded-l-md ${
              layout === "grid" ? "bg-muted text-primary" : ""
            }`}
            onClick={() => setLayout("grid")}
            aria-label="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none rounded-r-md ${
              layout === "list" ? "bg-muted text-primary" : ""
            }`}
            onClick={() => setLayout("list")}
            aria-label="List View"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
