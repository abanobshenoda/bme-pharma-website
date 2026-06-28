"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ShippingRuleInput = {
  ruleType: "QUANTITY" | "AMOUNT";
  minValue: number;
  maxValue?: number | null;
  price: number;
  currency: "EGP" | "USD";
  arabic_label?: string | null;
  english_label?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};

// ── Get all shipping rules ──

export async function getShippingRules() {
  try {
    const rules = await prisma.shippingRule.findMany({
      orderBy: [{ currency: "asc" }, { sortOrder: "asc" }, { minValue: "asc" }],
    });
    return { success: true, data: rules };
  } catch (error) {
    console.error("Failed to fetch shipping rules:", error);
    return { success: false, error: "Failed to fetch shipping rules" };
  }
}

// ── Get active rules for a specific currency ──

export async function getActiveShippingRules(currency: "EGP" | "USD") {
  try {
    const rules = await prisma.shippingRule.findMany({
      where: { isActive: true, currency },
      orderBy: [{ sortOrder: "asc" }, { minValue: "asc" }],
    });
    return { success: true, data: rules };
  } catch (error) {
    console.error("Failed to fetch active shipping rules:", error);
    return { success: false, error: "Failed to fetch active shipping rules" };
  }
}

// ── Calculate shipping fee ──
// Evaluates all active rules for the currency and returns the matching tier.
// cartItemCount: total quantity of all items in cart
// cartSubtotal: total price of all items (already in the checkout currency)

export async function calculateShippingFee({
  currency,
  cartItemCount,
  cartSubtotal,
}: {
  currency: "EGP" | "USD";
  cartItemCount: number;
  cartSubtotal: number;
}) {
  try {
    const rules = await prisma.shippingRule.findMany({
      where: { isActive: true, currency },
      orderBy: [{ sortOrder: "asc" }, { minValue: "asc" }],
    });

    if (rules.length === 0) {
      // Fallback to hardcoded default if no rules configured
      return { success: true, data: { fee: currency === "EGP" ? 100 : 2, label: null } };
    }

    // Find the best matching rule
    let matched = null;
    for (const rule of rules) {
      const checkValue = rule.ruleType === "QUANTITY" ? cartItemCount : cartSubtotal;
      const meetsMin = checkValue >= rule.minValue;
      const meetsMax = rule.maxValue === null || rule.maxValue === undefined || checkValue <= rule.maxValue;

      if (meetsMin && meetsMax) {
        matched = rule;
        // Keep going — last match wins (highest tier applicable)
      }
    }

    if (!matched) {
      // Fallback: use the first (lowest tier) rule
      matched = rules[0];
    }

    return {
      success: true,
      data: {
        fee: matched.price,
        label: { en: matched.english_label, ar: matched.arabic_label },
        ruleId: matched.id,
      },
    };
  } catch (error) {
    console.error("Failed to calculate shipping fee:", error);
    return { success: false, error: "Failed to calculate shipping fee" };
  }
}

// ── Create ──

export async function createShippingRule(data: ShippingRuleInput) {
  try {
    const rule = await prisma.shippingRule.create({ data });
    revalidatePath("/dashboard/shipping-rules");
    return { success: true, data: rule };
  } catch (error) {
    console.error("Failed to create shipping rule:", error);
    return { success: false, error: "Failed to create shipping rule" };
  }
}

// ── Update ──

export async function updateShippingRule(id: number, data: Partial<ShippingRuleInput>) {
  try {
    const rule = await prisma.shippingRule.update({ where: { id }, data });
    revalidatePath("/dashboard/shipping-rules");
    return { success: true, data: rule };
  } catch (error) {
    console.error("Failed to update shipping rule:", error);
    return { success: false, error: "Failed to update shipping rule" };
  }
}

// ── Delete ──

export async function deleteShippingRule(id: number) {
  try {
    await prisma.shippingRule.delete({ where: { id } });
    revalidatePath("/dashboard/shipping-rules");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete shipping rule:", error);
    return { success: false, error: "Failed to delete shipping rule" };
  }
}
