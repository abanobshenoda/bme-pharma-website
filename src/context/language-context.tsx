"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Simple translation helper
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  // Simple dictionary for now - ideally this moves to a separate file
  const dictionary: Record<string, Record<Language, string>> = {
    "nav.home": { en: "Home", ar: "الرئيسية" },
    "nav.about": { en: "About Us", ar: "عن الشركة" },
    "nav.contact": { en: "Contact Us", ar: "تواصل معنا" },
    "nav.store": { en: "Store", ar: "المتجر" },
    "nav.gallery": { en: "Gallery", ar: "المعرض" },
    "header.search": { en: "Search products...", ar: "بحث عن منتجات..." },
    "header.wishlist": { en: "Wishlist", ar: "المفضلة" },
    "header.cart": { en: "Cart", ar: "عربة التسوق" },
    "categories.title": { en: "Browse by Category", ar: "تصفح حسب الفئة" },
    "categories.description": {
      en: "Explore our wide range of pharmaceutical and healthcare products.",
      ar: "استكشف مجموعتنا الواسعة من المنتجات الصيدلانية والرعاية الصحية.",
    },
    "hero.title": { en: "Healthcare Every Day", ar: "رعاية صحية كل يوم" },
    "hero.subtitle": {
      en: "Welcome to BME Pharma. We are dedicated to providing the best healthcare solutions.",
      ar: "مرحبًا بكم في بي إم إي فارما. نحن ملتزمون بتقديم أفضل حلول الرعاية الصحية.",
    },
    "btn.getStarted": { en: "Get Started", ar: "ابدأ الآن" },
    "btn.learnMore": { en: "Learn More", ar: "اعرف المزيد" },
    "product.quickView": { en: "Quick View", ar: "نظرة سريعة" },
    "product.addToCart": { en: "Add to Cart", ar: "أضف إلى العربة" },
    "product.wishlistAdd": { en: "Add to Wishlist", ar: "أضف للمفضلة" },
    "product.wishlistRemove": {
      en: "Remove from Wishlist",
      ar: "إزالة من المفضلة",
    },
    "section.featured": { en: "Featured Products", ar: "منتجات مميزة" },
    "section.featuredDesc": {
      en: "Check out our latest and most popular healthcare products.",
      ar: "تحقق من أحدث منتجات الرعاية الصحية وأكثرها شهرة.",
    },
    "btn.viewAll": { en: "View All Products", ar: "عرض كل المنتجات" },
    "store.showing": { en: "Showing", ar: "عرض" },
    "store.results": { en: "results", ar: "نتائج" },
    "store.sortBy": { en: "Sort by:", ar: "ترتيب حسب:" },
    "store.categories": { en: "Categories", ar: "الأقسام" },
    "store.priceRange": { en: "Price Range", ar: "نطاق السعر" },
    "store.resetFilters": { en: "Reset Filters", ar: "إعادة تعيين الواجهة" },
    "store.noProducts": {
      en: "No products found.",
      ar: "لم يتم العثور على منتجات.",
    },
    "store.filters": { en: "Filters", ar: "تصفيات" },
  };

  const t = (key: string) => {
    return dictionary[key]?.[language] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t, dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
