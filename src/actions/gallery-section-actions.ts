"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import type { GallerySectionConfig } from "@/generated/prisma/client";

export type GallerySectionConfigInput = Omit<
  GallerySectionConfig,
  "id" | "createdAt" | "updatedAt"
>;

export const getGallerySectionConfig = async () => {
  try {
    const config = await prisma.gallerySectionConfig.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data: config };
  } catch (error) {
    console.error("Failed to fetch gallery section config:", error);
    return { success: false, error: "Failed to fetch gallery section config" };
  }
};

export const createGallerySectionConfig = async (
  data: GallerySectionConfigInput,
) => {
  try {
    const newConfig = await prisma.gallerySectionConfig.create({
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
        selectedImageIds: data.selectedImageIds,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: newConfig };
  } catch (error) {
    console.error("Failed to create gallery section config:", error);
    return {
      success: false,
      error: "Failed to create gallery section config",
    };
  }
};

export const updateGallerySectionConfig = async (
  id: number,
  data: Partial<GallerySectionConfigInput>,
) => {
  try {
    const updatedConfig = await prisma.gallerySectionConfig.update({
      where: { id },
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
        selectedImageIds: data.selectedImageIds,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: updatedConfig };
  } catch (error) {
    console.error("Failed to update gallery section config:", error);
    return {
      success: false,
      error: "Failed to update gallery section config",
    };
  }
};
