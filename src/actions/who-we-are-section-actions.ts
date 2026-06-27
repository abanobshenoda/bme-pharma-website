"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import type {
  WhoWeAreSection,
  WhoWeAreContent,
} from "@/generated/prisma/client";

export type WhoWeAreSectionInput = Omit<
  WhoWeAreSection,
  "id" | "createdAt" | "updatedAt"
>;

export type WhoWeAreContentInput = Omit<
  WhoWeAreContent,
  "id" | "createdAt" | "updatedAt"
>;

export const getWhoWeAreSection = async () => {
  try {
    const section = await prisma.whoWeAreSection.findFirst({
      orderBy: { id: "asc" },
      include: { contents: { orderBy: { id: "asc" } } },
    });
    return { success: true, data: section };
  } catch (error) {
    console.error("Failed to fetch who we are section:", error);
    return {
      success: false,
      error: "Failed to fetch who we are section",
    };
  }
};

export const createWhoWeAreSection = async (
  data: Omit<WhoWeAreSectionInput, "backgroundImage"> & {
    backgroundImage?: string | null;
  },
) => {
  try {
    const newSection = await prisma.whoWeAreSection.create({
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
        backgroundImage: data.backgroundImage || null,
      },
      include: { contents: true },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: newSection };
  } catch (error) {
    console.error("Failed to create who we are section:", error);
    return {
      success: false,
      error: "Failed to create who we are section",
    };
  }
};

export const updateWhoWeAreSection = async (
  id: number,
  data: Partial<WhoWeAreSectionInput>,
) => {
  try {
    const updatedSection = await prisma.whoWeAreSection.update({
      where: { id },
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
        backgroundImage: data.backgroundImage,
      },
      include: { contents: true },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: updatedSection };
  } catch (error) {
    console.error("Failed to update who we are section:", error);
    return {
      success: false,
      error: "Failed to update who we are section",
    };
  }
};

export const createWhoWeAreContent = async (data: WhoWeAreContentInput) => {
  try {
    const newContent = await prisma.whoWeAreContent.create({
      data: {
        icon: data.icon,
        arabic_title: data.arabic_title,
        english_title: data.english_title,
        arabic_subtitle: data.arabic_subtitle,
        english_subtitle: data.english_subtitle,
        sectionId: data.sectionId,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: newContent };
  } catch (error) {
    console.error("Failed to create who we are content:", error);
    return {
      success: false,
      error: "Failed to create who we are content",
    };
  }
};

export const updateWhoWeAreContent = async (
  id: number,
  data: Partial<Omit<WhoWeAreContentInput, "sectionId">>,
) => {
  try {
    const updatedContent = await prisma.whoWeAreContent.update({
      where: { id },
      data: {
        icon: data.icon,
        arabic_title: data.arabic_title,
        english_title: data.english_title,
        arabic_subtitle: data.arabic_subtitle,
        english_subtitle: data.english_subtitle,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: updatedContent };
  } catch (error) {
    console.error("Failed to update who we are content:", error);
    return {
      success: false,
      error: "Failed to update who we are content",
    };
  }
};

export const deleteWhoWeAreContent = async (id: number) => {
  try {
    await prisma.whoWeAreContent.delete({
      where: { id },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete who we are content:", error);
    return {
      success: false,
      error: "Failed to delete who we are content",
    };
  }
};
