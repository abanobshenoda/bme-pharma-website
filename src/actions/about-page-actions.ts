"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

const REVALIDATE_PATHS = ["/dashboard/pages-content/about-us", "/about-us"];

const revalidate = () => {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
};

// ── About Main Header ──

export const getAboutMainHeader = async () => {
  try {
    const data = await prisma.aboutMainHeader.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch about main header:", error);
    return { success: false, error: "Failed to fetch about main header" };
  }
};

export const createAboutMainHeader = async (payload: {
  arabic_header?: string | null;
  english_header?: string | null;
  arabic_description?: string | null;
  english_description?: string | null;
}) => {
  try {
    const data = await prisma.aboutMainHeader.create({ data: payload });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about main header:", error);
    return { success: false, error: "Failed to create about main header" };
  }
};

export const updateAboutMainHeader = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutMainHeader.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update about main header:", error);
    return { success: false, error: "Failed to update about main header" };
  }
};

// ── About Vision Section ──

export const getAboutVisionSection = async () => {
  try {
    const data = await prisma.aboutVisionSection.findFirst({
      orderBy: { id: "asc" },
      include: { items: { orderBy: { id: "asc" } } },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch about vision section:", error);
    return { success: false, error: "Failed to fetch about vision section" };
  }
};

export const createAboutVisionSection = async () => {
  try {
    const data = await prisma.aboutVisionSection.create({
      data: {},
      include: { items: true },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about vision section:", error);
    return { success: false, error: "Failed to create about vision section" };
  }
};

export const createAboutVisionItem = async (
  sectionId: number,
  payload: {
    icon?: string | null;
    arabic_title?: string | null;
    english_title?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutVisionItem.create({
      data: { ...payload, sectionId },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about vision item:", error);
    return { success: false, error: "Failed to create about vision item" };
  }
};

export const updateAboutVisionItem = async (
  id: number,
  payload: {
    icon?: string | null;
    arabic_title?: string | null;
    english_title?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutVisionItem.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update about vision item:", error);
    return { success: false, error: "Failed to update about vision item" };
  }
};

export const deleteAboutVisionItem = async (id: number) => {
  try {
    await prisma.aboutVisionItem.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete about vision item:", error);
    return { success: false, error: "Failed to delete about vision item" };
  }
};

// ── About Team Section ──

export const getAboutTeamSection = async () => {
  try {
    const data = await prisma.aboutTeamSection.findFirst({
      orderBy: { id: "asc" },
      include: { items: { orderBy: { id: "asc" } } },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch about team section:", error);
    return { success: false, error: "Failed to fetch about team section" };
  }
};

export const createAboutTeamSection = async () => {
  try {
    const data = await prisma.aboutTeamSection.create({
      data: {},
      include: { items: true },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about team section:", error);
    return { success: false, error: "Failed to create about team section" };
  }
};

export const updateAboutTeamSection = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutTeamSection.update({
      where: { id },
      data: payload,
      include: { items: true },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update about team section:", error);
    return { success: false, error: "Failed to update about team section" };
  }
};

export const createAboutTeamMember = async (
  sectionId: number,
  payload: {
    image?: string | null;
    arabic_name?: string | null;
    english_name?: string | null;
    arabic_title?: string | null;
    english_title?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutTeamMember.create({
      data: { ...payload, sectionId },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about team member:", error);
    return { success: false, error: "Failed to create about team member" };
  }
};

export const updateAboutTeamMember = async (
  id: number,
  payload: {
    image?: string | null;
    arabic_name?: string | null;
    english_name?: string | null;
    arabic_title?: string | null;
    english_title?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutTeamMember.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update about team member:", error);
    return { success: false, error: "Failed to update about team member" };
  }
};

export const deleteAboutTeamMember = async (id: number) => {
  try {
    await prisma.aboutTeamMember.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete about team member:", error);
    return { success: false, error: "Failed to delete about team member" };
  }
};

// ── About Heroes Section ──

export const getAboutHeroesSection = async () => {
  try {
    const data = await prisma.aboutHeroesSection.findFirst({
      orderBy: { id: "asc" },
      include: { items: { orderBy: { id: "asc" } } },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch about heroes section:", error);
    return { success: false, error: "Failed to fetch about heroes section" };
  }
};

export const createAboutHeroesSection = async () => {
  try {
    const data = await prisma.aboutHeroesSection.create({
      data: {},
      include: { items: true },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about heroes section:", error);
    return { success: false, error: "Failed to create about heroes section" };
  }
};

export const updateAboutHeroesSection = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutHeroesSection.update({
      where: { id },
      data: payload,
      include: { items: true },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update about heroes section:", error);
    return { success: false, error: "Failed to update about heroes section" };
  }
};

export const createAboutHeroItem = async (
  sectionId: number,
  payload: {
    image?: string | null;
    arabic_name?: string | null;
    english_name?: string | null;
    arabic_title?: string | null;
    english_title?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutHeroItem.create({
      data: { ...payload, sectionId },
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create about hero item:", error);
    return { success: false, error: "Failed to create about hero item" };
  }
};

export const updateAboutHeroItem = async (
  id: number,
  payload: {
    image?: string | null;
    arabic_name?: string | null;
    english_name?: string | null;
    arabic_title?: string | null;
    english_title?: string | null;
  },
) => {
  try {
    const data = await prisma.aboutHeroItem.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update about hero item:", error);
    return { success: false, error: "Failed to update about hero item" };
  }
};

export const deleteAboutHeroItem = async (id: number) => {
  try {
    await prisma.aboutHeroItem.delete({ where: { id } });
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete about hero item:", error);
    return { success: false, error: "Failed to delete about hero item" };
  }
};
