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
  // Discount fields
  discountType?: "PERCENTAGE" | "BUY_X_GET_Y"; // Default: PERCENTAGE
  discount?: number; // Discount percentage (used when discountType = PERCENTAGE)
  buyXQuantity?: number; // Buy X items... (used when discountType = BUY_X_GET_Y)
  getYQuantity?: number; // ...get Y items free
  image: string; // Main image
  images?: string[]; // Gallery images
  category: string;
  categoryId?: string;
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
