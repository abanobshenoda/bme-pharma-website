"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import type { GalleryImage } from "@/generated/prisma/client";

export type GalleryImageInput = Omit<
  GalleryImage,
  "id" | "createdAt" | "updatedAt"
>;

export const getGalleryImages = async () => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return { success: true, data: images };
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return { success: false, error: "Failed to fetch gallery images" };
  }
};

export const createGalleryImage = async (data: GalleryImageInput) => {
  try {
    const newImage = await prisma.galleryImage.create({
      data: {
        url: data.url,
        alt: data.alt,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    revalidatePath("/dashboard/gallery-images");
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true, data: newImage };
  } catch (error) {
    console.error("Failed to create gallery image:", error);
    return { success: false, error: "Failed to create gallery image" };
  }
};

export const deleteGalleryImage = async (id: number) => {
  try {
    await prisma.galleryImage.delete({
      where: { id },
    });
    revalidatePath("/dashboard/gallery-images");
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return { success: false, error: "Failed to delete gallery image" };
  }
};
export const updateGalleryImage = async (
  id: number,
  data: Partial<GalleryImageInput>,
) => {
  try {
    const updatedImage = await prisma.galleryImage.update({
      where: { id },
      data: {
        url: data.url,
        alt: data.alt,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    revalidatePath("/dashboard/gallery-images");
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true, data: updatedImage };
  } catch (error) {
    console.error("Failed to update gallery image:", error);
    return { success: false, error: "Failed to update gallery image" };
  }
};
