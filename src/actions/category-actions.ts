"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { Category } from "@/generated/prisma/client";

export type CategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt">;

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: categories };
  } catch (_error) {
    return { success: false, error: "Failed to fetch categories" };
  }
};

export const getCategory = async (id: number) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    return { success: true, data: category };
  } catch (_error) {
    return { success: false, error: "Failed to fetch category" };
  }
};

export const createCategory = async (data: CategoryInput) => {
  try {
    const newCategory = await prisma.category.create({
      data: {
        image: data.image,
        arabic_name: data.arabic_name,
        english_name: data.english_name,
      },
    });
    revalidatePath("/dashboard/category");
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
};

export const updateCategory = async (
  id: number,
  data: Partial<CategoryInput>,
) => {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        image: data.image,
        arabic_name: data.arabic_name,
        english_name: data.english_name,
      },
    });
    revalidatePath("/dashboard/category");
    return { success: true, data: updatedCategory };
  } catch (_error) {
    return { success: false, error: "Failed to update category" };
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/dashboard/category");
    return { success: true };
  } catch (_error) {
    return { success: false, error: "Failed to delete category" };
  }
};
