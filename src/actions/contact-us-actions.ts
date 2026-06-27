"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

const REVALIDATE_PATHS = ["/dashboard/pages-content/contact-us", "/contact-us"];

const revalidate = () => {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
};

export const getContactUsSection = async () => {
  try {
    const data = await prisma.contactUsSection.findFirst({
      orderBy: { id: "asc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch contact us section:", error);
    return { success: false, error: "Failed to fetch contact us section" };
  }
};

export const createContactUsSection = async (payload: {
  arabic_header?: string | null;
  english_header?: string | null;
  arabic_description?: string | null;
  english_description?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}) => {
  try {
    const data = await prisma.contactUsSection.create({ data: payload });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create contact us section:", error);
    return { success: false, error: "Failed to create contact us section" };
  }
};

export const updateContactUsSection = async (
  id: number,
  payload: {
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  },
) => {
  try {
    const data = await prisma.contactUsSection.update({
      where: { id },
      data: payload,
    });
    revalidate();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to update contact us section:", error);
    return { success: false, error: "Failed to update contact us section" };
  }
};

// ── Contact Messages (Get in Touch form) ──

export const createContactMessage = async (payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    const data = await prisma.contactMessage.create({ data: payload });
    revalidatePath("/dashboard/pages-content/contact-us");
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create contact message:", error);
    return { success: false, error: "Failed to send message" };
  }
};

export const getContactMessages = async () => {
  try {
    const data = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
};

export const markMessageAsRead = async (id: number) => {
  try {
    const data = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
    revalidatePath("/dashboard/pages-content/contact-us");
    return { success: true, data };
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
};

export const deleteContactMessage = async (id: number) => {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/dashboard/pages-content/contact-us");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return { success: false, error: "Failed to delete message" };
  }
};
