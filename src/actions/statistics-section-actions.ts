"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import type {
  StatisticsSection,
  StatisticsItem,
} from "@/generated/prisma/client";

export type StatisticsSectionInput = Omit<
  StatisticsSection,
  "id" | "createdAt" | "updatedAt"
>;

export type StatisticsItemInput = Omit<
  StatisticsItem,
  "id" | "sectionId" | "createdAt" | "updatedAt"
>;

export const getStatisticsSection = async () => {
  try {
    const section = await prisma.statisticsSection.findFirst({
      orderBy: { id: "asc" },
      include: {
        items: {
          orderBy: { id: "asc" },
        },
      },
    });
    return { success: true, data: section };
  } catch (error) {
    console.error("Failed to fetch statistics section:", error);
    return { success: false, error: "Failed to fetch statistics section" };
  }
};

export const createStatisticsSection = async (data: StatisticsSectionInput) => {
  try {
    const newSection = await prisma.statisticsSection.create({
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: newSection };
  } catch (error) {
    console.error("Failed to create statistics section:", error);
    return { success: false, error: "Failed to create statistics section" };
  }
};

export const updateStatisticsSection = async (
  id: number,
  data: Partial<StatisticsSectionInput>,
) => {
  try {
    const updatedSection = await prisma.statisticsSection.update({
      where: { id },
      data: {
        arabic_header: data.arabic_header,
        english_header: data.english_header,
        arabic_description: data.arabic_description,
        english_description: data.english_description,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: updatedSection };
  } catch (error) {
    console.error("Failed to update statistics section:", error);
    return { success: false, error: "Failed to update statistics section" };
  }
};

export const createStatisticsItem = async (
  sectionId: number,
  data: StatisticsItemInput,
) => {
  try {
    const newItem = await prisma.statisticsItem.create({
      data: {
        ...data,
        sectionId,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: newItem };
  } catch (error) {
    console.error("Failed to create statistics item:", error);
    return { success: false, error: "Failed to create statistics item" };
  }
};

export const updateStatisticsItem = async (
  id: number,
  data: Partial<StatisticsItemInput>,
) => {
  try {
    const updatedItem = await prisma.statisticsItem.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Failed to update statistics item:", error);
    return { success: false, error: "Failed to update statistics item" };
  }
};

export const deleteStatisticsItem = async (id: number) => {
  try {
    await prisma.statisticsItem.delete({
      where: { id },
    });
    revalidatePath("/dashboard/pages-content/homepage");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete statistics item:", error);
    return { success: false, error: "Failed to delete statistics item" };
  }
};
