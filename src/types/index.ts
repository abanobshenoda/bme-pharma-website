export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  email: string;
}

export type Language = "en" | "ar";

export interface NavItem {
  title: string;
  href: string;
}

export interface Product {
  id: string;
  name: { en: string; ar: string };
  price: number; // Base price
  currency?: Currency; // Base currency (USD or EGP)
  discount?: number; // Discount percentage
  image: string; // Main image
  images?: string[]; // Gallery images
  category: string;
  description?: {
    en: string;
    ar: string;
  };
  sku?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
}

export type Currency = "USD" | "EGP";
