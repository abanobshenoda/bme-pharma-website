"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

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

    // 2. Calculate totals using DB prices and apply conversion if necessary
    //    For simplicity in this V1, we assume all items are converted to the checkout currency.
    //    We will calculate the conversion safely on the server side if needed, or rely on the frontend
    //    providing the current checkout currency and we do a standard check.
    //    For accurate production billing, a server-side exchange rate is best,
    //    but here we replicate the context logic:

    let subtotal = 0;
    const EXCHANGE_RATE = 50; // Sync with context

    const orderItemsData = data.items.map((item) => {
      const product = products.find(
        (p: { id: number }) => p.id === item.productId,
      )!;

      const price = product.price || 0;
      const discount = product.discount || 0;
      const discountedPrice = price - (price * discount) / 100;

      let finalUnitPrice = discountedPrice;
      const baseCurrency = product.currency || "USD";

      // Conversion logic matching context
      if (data.currency === "EGP" && baseCurrency === "USD") {
        finalUnitPrice = discountedPrice * EXCHANGE_RATE;
      } else if (data.currency === "USD" && baseCurrency === "EGP") {
        finalUnitPrice = discountedPrice / EXCHANGE_RATE;
      }

      const totalPrice = finalUnitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        productId: product.id,
        productName: product.english_name || product.arabic_name || "Unknown",
        quantity: item.quantity,
        unitPrice: finalUnitPrice,
        totalPrice: totalPrice,
      };
    });

    // Simple shipping fee logic based on currency
    const shippingFee = data.currency === "EGP" ? 100 : 2;
    const total = subtotal + shippingFee;

    // 3. Create the order
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
        total,
        // If COD, payment is PENDING. If MANUAL and they uploaded an image, it's also PENDING review.
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    // Revalidate dashboard orders page
    revalidatePath("/dashboard/orders");

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
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
