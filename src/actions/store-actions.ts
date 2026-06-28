"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import type {
  StorePage,
  ProductsPage,
} from "@/generated/prisma/client";

const REVALIDATE_PATHS = [
  "/store",
  "/products",
  "/dashboard/pages-content/store",
  "/dashboard/pages-content/products",
  "/dashboard/products",
  "/",
];

const revalidate = () => {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
};

// ── Store Page Content ──

export const getStorePage = async () => {
  try {
    const data = await prisma.storePage.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch store page:", error);
    return { success: false, error: "Failed to fetch store page" };
  }
};

export const createStorePage = async (payload: {
  arabic_header?: string | null;
  english_header?: string | null;
  arabic_description?: string | null;
  english_description?: string | null;
}) => {
  try {
    const data = await prisma.storePage.create({ data: payload });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create store page:", error);
    return { success: false, error: "Failed to create store page" };
  }
};

export const updateStorePage = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.storePage.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update store page:", error);
    return { success: false, error: "Failed to update store page" };
  }
};

// ── Products Page Content ──

export const getProductsPage = async () => {
  try {
    const data = await prisma.productsPage.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch products page:", error);
    return { success: false, error: "Failed to fetch products page" };
  }
};

export const createProductsPage = async (payload: {
  arabic_header?: string | null;
  english_header?: string | null;
  arabic_description?: string | null;
  english_description?: string | null;
}) => {
  try {
    const data = await prisma.productsPage.create({ data: payload });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create products page:", error);
    return { success: false, error: "Failed to create products page" };
  }
};

export const updateProductsPage = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.productsPage.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update products page:", error);
    return { success: false, error: "Failed to update products page" };
  }
};

// ── Product CRUD ──

export type ProductInput = {
  english_name: string;
  arabic_name?: string | null;
  price?: number | null;
  currency?: string;
  // Discount
  discountType?: string; // "PERCENTAGE" | "BUY_X_GET_Y"
  discount?: number | null; // Percentage value (0-100)
  buyXQuantity?: number | null; // Buy X items...
  getYQuantity?: number | null; // ...get Y items free
  image?: string | null;
  images?: string[];
  arabic_description?: string | null;
  english_description?: string | null;
  sku?: string | null;
  stock?: number | null;
  rating?: number | null;
  reviews?: number | null;
  isFeatured?: boolean;
  categoryIds: number[]; // ← many-to-many: list of category IDs
};

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
};

export const createProduct = async (payload: ProductInput) => {
  try {
    const { categoryIds, ...rest } = payload;
    const product = await prisma.product.create({
      data: {
        ...rest,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
      include: { categories: true },
    });
    revalidate();
    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
};

export const updateProduct = async (
  id: number,
  payload: Partial<ProductInput>,
) => {
  try {
    const { categoryIds, ...rest } = payload;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryIds !== undefined && {
          categories: {
            set: categoryIds.map((cid) => ({ id: cid })),
          },
        }),
      },
      include: { categories: true },
    });
    revalidate();
    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await prisma.product.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
};

export const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { categories: true },
    });
    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
};

export const getFeaturedProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return { success: false, error: "Failed to fetch featured products" };
  }
};
