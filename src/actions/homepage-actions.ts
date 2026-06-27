"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { HeroSlide } from "@/generated/prisma/client";

export async function getSlides() {
  try {
    const slides = await prisma.heroSlide.findMany();
    return { success: true, data: slides };
  } catch (error) {
    return { success: false, error: "Failed to fetch slides" };
  }
}

export async function getHero() {
  try {
    const hero = await prisma.heroSlide.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data: hero };
  } catch (error) {
    return { success: false, error: "Failed to fetch hero" };
  }
}

// Define the input type explicitly to exclude system-managed fields
export type HeroSlideInput = Omit<HeroSlide, "id" | "createdAt" | "updatedAt">;

export async function createSlide(data: HeroSlideInput) {
  try {
    const newSlide = await prisma.heroSlide.create({
      data: {
        image: data.image,
        arabic_buttonLink: data.arabic_buttonLink,
        english_buttonLink: data.english_buttonLink,
        arabic_buttonText: data.arabic_buttonText,
        english_buttonText: data.english_buttonText,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
        arabic_subtitle: data.arabic_subtitle,
        english_subtitle: data.english_subtitle,
        arabic_title: data.arabic_title,
        english_title: data.english_title,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    return { success: true, data: newSlide };
  } catch (error) {
    return { success: false, error: "Failed to create slide" };
  }
}

export async function updateSlide(id: number, data: Partial<HeroSlideInput>) {
  try {
    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: {
        image: data.image,
        arabic_buttonLink: data.arabic_buttonLink,
        english_buttonLink: data.english_buttonLink,
        arabic_buttonText: data.arabic_buttonText,
        english_buttonText: data.english_buttonText,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
        arabic_subtitle: data.arabic_subtitle,
        english_subtitle: data.english_subtitle,
        arabic_title: data.arabic_title,
        english_title: data.english_title,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    return { success: true, data: updatedSlide };
  } catch (error) {
    return { success: false, error: "Failed to update slide" };
  }
}

export async function deleteSlide(id: number) {
  try {
    await prisma.heroSlide.delete({
      where: { id },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete slide" };
  }
}
