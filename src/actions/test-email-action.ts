"use server";

import { sendOrderNotificationEmail } from "@/lib/email";
import prisma from "@/lib/db";

/**
 * Sends a fake "test" order email to the admin address stored in CompanyInfo.
 * Does NOT create any real order in the database.
 */
export async function sendTestOrderEmail(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const companyInfo = await prisma.companyInfo.findFirst({
      select: { email: true },
    });

    if (!companyInfo?.email) {
      return {
        success: false,
        message:
          "No admin email configured. Please set the Email field in Company Info first.",
      };
    }

    const fakeOrder = {
      id: "test-1234-abcd-5678",
      customerName: "Ahmed Test Customer",
      customerEmail: "customer@example.com",
      customerPhone: "01012345678",
      shippingAddress: "123 Test Street, Building 5, Apartment 3",
      city: "Cairo",
      paymentMethod: "COD",
      currency: "EGP",
      subtotal: 450,
      shippingFee: 50,
      total: 500,
      notes: "This is a TEST email — no real order was created.",
      items: [
        {
          productName: "Test Product Alpha",
          quantity: 2,
          unitPrice: 150,
          totalPrice: 300,
        },
        {
          productName: "Test Product Beta",
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
        },
      ],
      createdAt: new Date(),
    };

    await sendOrderNotificationEmail(fakeOrder, companyInfo.email);

    return {
      success: true,
      message: `Test email sent successfully to ${companyInfo.email}`,
    };
  } catch (error: any) {
    console.error("[TestEmail] Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to send test email.",
    };
  }
}
