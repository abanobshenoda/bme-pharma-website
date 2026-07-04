"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PromoCodeInput = {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  currency: string;
  isActive: boolean;
  usageLimit?: number | null;
  minOrderValue?: number | null;
  expiresAt?: string | null; // ISO string from form
  description?: string | null;
};

export type ValidatePromoResult =
  | {
      success: true;
      id: number;
      code: string;
      discountType: "PERCENTAGE" | "FIXED";
      discountValue: number;
      currency: string;
      discountAmount: number; // computed discount for this specific order
    }
  | { success: false; error: string };

// ── Validate promo code at checkout ──────────────────────────────────────────

export async function validatePromoCode(
  code: string,
  orderCurrency: string,
  subtotal: number
): Promise<ValidatePromoResult> {
  try {
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!promo) {
      return { success: false, error: "Invalid promo code." };
    }

    if (!promo.isActive) {
      return { success: false, error: "This promo code is no longer active." };
    }

    if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
      return { success: false, error: "This promo code has expired." };
    }

    if (
      promo.usageLimit !== null &&
      promo.usageLimit !== undefined &&
      promo.usageCount >= promo.usageLimit
    ) {
      return { success: false, error: "This promo code has reached its usage limit." };
    }

    if (promo.minOrderValue !== null && promo.minOrderValue !== undefined) {
      if (subtotal < promo.minOrderValue) {
        return {
          success: false,
          error: `Minimum order value of ${promo.currency} ${promo.minOrderValue} required.`,
        };
      }
    }

    // Calculate actual discount amount
    let discountAmount = 0;

    if (promo.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * promo.discountValue) / 100;
    } else {
      // FIXED — convert currency if needed
      const EXCHANGE_RATE = 50;
      let fixedAmount = promo.discountValue;

      if (orderCurrency === "EGP" && promo.currency === "USD") {
        fixedAmount = promo.discountValue * EXCHANGE_RATE;
      } else if (orderCurrency === "USD" && promo.currency === "EGP") {
        fixedAmount = promo.discountValue / EXCHANGE_RATE;
      }

      discountAmount = Math.min(fixedAmount, subtotal); // can't exceed subtotal
    }

    return {
      success: true,
      id: promo.id,
      code: promo.code,
      discountType: promo.discountType as "PERCENTAGE" | "FIXED",
      discountValue: promo.discountValue,
      currency: promo.currency,
      discountAmount,
    };
  } catch (error) {
    console.error("[PromoCode] validate error:", error);
    return { success: false, error: "Failed to validate promo code." };
  }
}

// ── Increment usage count after order is placed ───────────────────────────────

export async function incrementPromoUsage(promoCode: string): Promise<void> {
  try {
    await prisma.promoCode.update({
      where: { code: promoCode },
      data: { usageCount: { increment: 1 } },
    });
  } catch (error) {
    console.error("[PromoCode] increment error:", error);
  }
}

// ── CRUD for dashboard ────────────────────────────────────────────────────────

export async function getPromoCodes() {
  try {
    const codes = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: codes };
  } catch (error) {
    console.error("[PromoCode] getPromoCodes error:", error);
    return { success: false, error: "Failed to fetch promo codes." };
  }
}

export async function createPromoCode(data: PromoCodeInput) {
  try {
    const code = data.code.trim().toUpperCase();

    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      return { success: false, error: "A promo code with this name already exists." };
    }

    const created = await prisma.promoCode.create({
      data: {
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        currency: data.currency,
        isActive: data.isActive,
        usageLimit: data.usageLimit ?? null,
        minOrderValue: data.minOrderValue ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        description: data.description ?? null,
      },
    });

    revalidatePath("/dashboard/promo-codes");
    return { success: true, data: created };
  } catch (error) {
    console.error("[PromoCode] createPromoCode error:", error);
    return { success: false, error: "Failed to create promo code." };
  }
}

export async function updatePromoCode(id: number, data: Partial<PromoCodeInput>) {
  try {
    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(data.discountType !== undefined && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
        ...(data.minOrderValue !== undefined && { minOrderValue: data.minOrderValue }),
        ...(data.expiresAt !== undefined && {
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
    revalidatePath("/dashboard/promo-codes");
    return { success: true, data: updated };
  } catch (error) {
    console.error("[PromoCode] updatePromoCode error:", error);
    return { success: false, error: "Failed to update promo code." };
  }
}

export async function togglePromoCodeStatus(id: number, isActive: boolean) {
  try {
    await prisma.promoCode.update({ where: { id }, data: { isActive } });
    revalidatePath("/dashboard/promo-codes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status." };
  }
}

export async function deletePromoCode(id: number) {
  try {
    await prisma.promoCode.delete({ where: { id } });
    revalidatePath("/dashboard/promo-codes");
    return { success: true };
  } catch (error) {
    console.error("[PromoCode] deletePromoCode error:", error);
    return { success: false, error: "Failed to delete promo code." };
  }
}
