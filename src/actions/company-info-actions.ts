"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { CompanyInfo } from "@/generated/prisma/client";

export type CompanyInfoInput = Omit<
  CompanyInfo,
  "id" | "createdAt" | "updatedAt"
>;

export const getCompanyInfo = async () => {
  try {
    const companyInfo = await prisma.companyInfo.findFirst();
    return { success: true, data: companyInfo };
  } catch (error) {
    console.error("Failed to fetch company info:", error);
    return { success: false, error: "Failed to fetch company info" };
  }
};

export const updateCompanyInfo = async (data: CompanyInfoInput) => {
  try {
    const existingInfo = await prisma.companyInfo.findFirst();

    let updatedInfo;
    if (existingInfo) {
      updatedInfo = await prisma.companyInfo.update({
        where: { id: existingInfo.id },
        data,
      });
    } else {
      updatedInfo = await prisma.companyInfo.create({
        data,
      });
    }

    revalidatePath("/dashboard/pages-content/company-info");
    revalidatePath("/");
    return { success: true, data: updatedInfo };
  } catch (error) {
    console.error("Failed to update company info:", error);
    return { success: false, error: "Failed to update company info" };
  }
};
