"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

const REVALIDATE_PATHS = ["/dashboard/pages-content/gallery", "/gallery"];

const revalidate = () => {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
};

// ── Gallery Page Header ──

export const getGalleryPage = async () => {
  try {
    const data = await prisma.galleryPage.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch gallery page details:", error);
    return { success: false, error: "Failed to fetch gallery page details" };
  }
};

export const createGalleryPage = async (payload: {
  arabic_header?: string | null;
  english_header?: string | null;
  arabic_description?: string | null;
  english_description?: string | null;
}) => {
  try {
    const data = await prisma.galleryPage.create({ data: payload });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create gallery page details:", error);
    return { success: false, error: "Failed to create gallery page details" };
  }
};

export const updateGalleryPage = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.galleryPage.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update gallery page details:", error);
    return { success: false, error: "Failed to update gallery page details" };
  }
};

// ── Gallery Categories ──

export const getGalleryCategories = async () => {
  try {
    const data = await prisma.galleryCategory.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { images: true } } },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch gallery categories:", error);
    return { success: false, error: "Failed to fetch gallery categories" };
  }
};

export const createGalleryCategory = async (payload: {
  arabic_name: string;
  english_name: string;
}) => {
  try {
    const data = await prisma.galleryCategory.create({ data: payload });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create gallery category:", error);
    return { success: false, error: "Failed to create gallery category" };
  }
};

export const updateGalleryCategory = async (
  id: number,
  payload: {
    arabic_name?: string;
    english_name?: string;
  },
) => {
  try {
    const data = await prisma.galleryCategory.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update gallery category:", error);
    return { success: false, error: "Failed to update gallery category" };
  }
};

export const deleteGalleryCategory = async (id: number) => {
  try {
    await prisma.galleryCategory.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gallery category:", error);
    return { success: false, error: "Failed to delete gallery category" };
  }
};
