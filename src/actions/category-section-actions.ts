"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { CategorySection } from "@/generated/prisma/client";

export type CategorySectionInput = Omit<
  CategorySection,
  "id" | "createdAt" | "updatedAt"
>;

export const getCategorySection = async () => {
  try {
    const section = await prisma.categorySection.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data: section };
  } catch (error) {
    return { success: false, error: "Failed to fetch category section" };
  }
};

export const createCategorySection = async (data: CategorySectionInput) => {
  try {
    const newSection = await prisma.categorySection.create({
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    return { success: true, data: newSection };
  } catch (error) {
    return { success: false, error: "Failed to create category section" };
  }
};

export const updateCategorySection = async (
  id: number,
  data: Partial<CategorySectionInput>,
) => {
  try {
    const updatedSection = await prisma.categorySection.update({
      where: { id },
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    return { success: true, data: updatedSection };
  } catch (error) {
    return { success: false, error: "Failed to update category section" };
  }
};
