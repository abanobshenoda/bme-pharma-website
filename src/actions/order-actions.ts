"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendOrderNotificationEmail } from "@/lib/email";
import { validatePromoCode, incrementPromoUsage } from "@/actions/promo-code-actions";

// Local type to handle the new discount fields returned from DB query
type ProductWithDiscount = {
  id: number;
  english_name: string;
  arabic_name: string | null;
  price: number | null;
  currency: string;
  discount: number | null;
  discountType: string;
  buyXQuantity: number | null;
  getYQuantity: number | null;
};

export type OrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod: "COD" | "MANUAL";
  receiptImage?: string;
  notes?: string;
  currency: string;
  promoCode?: string; // optional applied promo code
  items: {
    productId: number;
    quantity: number;
  }[];
};

export async function createOrder(data: OrderInput) {
  try {
    // 1. Fetch current product prices and currencies from DB to prevent tampering
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== data.items.length) {
      return { success: false, error: "One or more products not found" };
    }

    // 2. Calculate totals using DB prices, discounts, and currency conversion
    let subtotal = 0;
    const EXCHANGE_RATE = 50; // Sync with context
    let totalCartItemCount = 0;

    const orderItemsData = data.items.map((item) => {
      const product = products.find(
        (p) => p.id === item.productId,
      )! as unknown as ProductWithDiscount;

      const price = product.price || 0;
      const discountType = product.discountType || "PERCENTAGE";

      const paidQuantity = item.quantity;
      let freeItems = 0;

      if (discountType === "BUY_X_GET_Y") {
        const buyX = product.buyXQuantity || 1;
        const getY = product.getYQuantity || 1;
        freeItems = Math.floor(item.quantity / buyX) * getY;
      }

      const discount = discountType === "PERCENTAGE" ? (product.discount || 0) : 0;
      const discountedPrice = price - (price * discount) / 100;

      let finalUnitPrice = discountedPrice;
      const baseCurrency = product.currency || "USD";

      // Conversion logic matching context
      if (data.currency === "EGP" && baseCurrency === "USD") {
        finalUnitPrice = discountedPrice * EXCHANGE_RATE;
      } else if (data.currency === "USD" && baseCurrency === "EGP") {
        finalUnitPrice = discountedPrice / EXCHANGE_RATE;
      }

      const totalPrice = finalUnitPrice * paidQuantity;
      subtotal += totalPrice;
      totalCartItemCount += item.quantity + freeItems;

      return {
        productId: product.id,
        productName: product.english_name || product.arabic_name || "Unknown",
        quantity: item.quantity + freeItems,
        unitPrice: finalUnitPrice,
        totalPrice: totalPrice,
      };
    });

    // 3. Calculate shipping fee dynamically from DB rules
    let shippingFee = data.currency === "EGP" ? 100 : 2; // fallback

    const shippingRules = await prisma.shippingRule.findMany({
      where: { isActive: true, currency: data.currency },
      orderBy: [{ sortOrder: "asc" }, { minValue: "asc" }],
    });

    if (shippingRules.length > 0) {
      let matched = null;
      for (const rule of shippingRules) {
        const checkValue =
          rule.ruleType === "QUANTITY" ? totalCartItemCount : subtotal;
        const meetsMin = checkValue >= rule.minValue;
        const meetsMax =
          rule.maxValue === null || rule.maxValue === undefined || checkValue <= rule.maxValue;

        if (meetsMin && meetsMax) {
          matched = rule;
        }
      }
      if (!matched) matched = shippingRules[0];
      shippingFee = matched.price;
    }

    // 4. Validate promo code server-side (prevents frontend tampering)
    let promoDiscount = 0;
    let appliedPromoCode: string | undefined = undefined;

    if (data.promoCode && data.promoCode.trim()) {
      const promoResult = await validatePromoCode(
        data.promoCode.trim(),
        data.currency,
        subtotal
      );
      if (promoResult.success) {
        promoDiscount = promoResult.discountAmount;
        appliedPromoCode = promoResult.code;
      }
      // If invalid, we silently skip the discount (order still goes through)
    }

    const total = subtotal + shippingFee - promoDiscount;

    // 5. Create the order
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        city: data.city,
        paymentMethod: data.paymentMethod,
        currency: data.currency,
        notes: data.notes,
        receiptImage: data.receiptImage,
        subtotal,
        shippingFee,
        promoCode: appliedPromoCode,
        promoDiscount,
        total,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    // Increment promo usage count
    if (appliedPromoCode) {
      await incrementPromoUsage(appliedPromoCode);
    }

    // Revalidate dashboard orders page
    revalidatePath("/dashboard/orders");

    // Send admin email notification (non-blocking — errors are caught inside)
    try {
      const companyInfo = await prisma.companyInfo.findFirst({
        select: { email: true },
      });
      await sendOrderNotificationEmail(
        {
          ...order,
          items: orderItemsData,
        },
        companyInfo?.email
      );
    } catch (emailError) {
      console.error("[Order] Email notification error:", emailError);
    }

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: { isDeleted: false } as any,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return { success: true, data: orders };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) return { success: false, error: "Order not found" };
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

export async function updateOrderStatus(id: string, orderStatus: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus },
    });
    revalidatePath("/dashboard/orders");
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
    revalidatePath("/dashboard/orders");
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

export async function deleteOrder(id: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { isDeleted: true } as any,
    });
    revalidatePath("/dashboard/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

