"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { FeaturedProductsSection } from "@/generated/prisma/client";

export type FeaturedProductsSectionInput = Omit<
  FeaturedProductsSection,
  "id" | "createdAt" | "updatedAt"
>;

export const getFeaturedProductsSection = async () => {
  try {
    const section = await prisma.featuredProductsSection.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data: section };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to fetch featured products section",
    };
  }
};

export const createFeaturedProductsSection = async (
  data: FeaturedProductsSectionInput,
) => {
  try {
    const newSection = await prisma.featuredProductsSection.create({
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/dashboard/pages-content/store");
    revalidatePath("/");
    return { success: true, data: newSection };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to create featured products section",
    };
  }
};

export const updateFeaturedProductsSection = async (
  id: number,
  data: Partial<FeaturedProductsSectionInput>,
) => {
  try {
    const updatedSection = await prisma.featuredProductsSection.update({
      where: { id },
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/dashboard/pages-content/store");
    revalidatePath("/");
    return { success: true, data: updatedSection };
  } catch (_error) {
    return {
      success: false,
      error: "Failed to update featured products section",
    };
  }
};
