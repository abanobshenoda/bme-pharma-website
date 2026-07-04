import nodemailer from "nodemailer";

/**
 * Creates a Gmail SMTP transporter using environment variables.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD to be set in .env
 * Get an App Password at: https://myaccount.google.com/apppasswords
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderEmailData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod: string;
  currency: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  notes?: string | null;
  items: OrderItem[];
  createdAt: Date;
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "EGP" ? "E£" : "$";
  return `${symbol}${amount.toFixed(2)}`;
}

function buildOrderEmailHtml(order: OrderEmailData): string {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 10px 12px; color: #333;">${item.productName}</td>
        <td style="padding: 10px 12px; text-align: center; color: #555;">${item.quantity}</td>
        <td style="padding: 10px 12px; text-align: right; color: #555;">${formatCurrency(item.unitPrice, order.currency)}</td>
        <td style="padding: 10px 12px; text-align: right; font-weight: 600; color: #1a1a2e;">${formatCurrency(item.totalPrice, order.currency)}</td>
      </tr>`
    )
    .join("");

  const paymentBadgeColor =
    order.paymentMethod === "COD" ? "#16a34a" : "#2563eb";
  const paymentLabel =
    order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank / E-Wallet Transfer";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Order Notification</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">🛒 New Order Received</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">BME Pharma Order Management</p>
            </td>
          </tr>

          <!-- Order ID Banner -->
          <tr>
            <td style="background:#f8faff;padding:16px 40px;border-bottom:1px solid #e8edf5;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Order ID</span><br/>
                    <span style="font-size:15px;color:#1a1a2e;font-weight:700;font-family:monospace;">#${order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:${paymentBadgeColor};color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:600;">${paymentLabel}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Customer Info -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#1a1a2e;font-weight:700;border-bottom:2px solid #0f3460;padding-bottom:8px;">👤 Customer Information</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:5px 0;width:40%;font-size:13px;color:#6b7280;font-weight:500;">Full Name</td>
                  <td style="padding:5px 0;font-size:13px;color:#1a1a2e;font-weight:600;">${order.customerName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:500;">Email</td>
                  <td style="padding:5px 0;font-size:13px;color:#1a1a2e;font-weight:600;">${order.customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:500;">WhatsApp / Phone</td>
                  <td style="padding:5px 0;font-size:13px;color:#1a1a2e;font-weight:600;">${order.customerPhone}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:13px;color:#6b7280;font-weight:500;">City</td>
                  <td style="padding:5px 0;font-size:13px;color:#1a1a2e;font-weight:600;">${order.city}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;vertical-align:top;font-size:13px;color:#6b7280;font-weight:500;">Address</td>
                  <td style="padding:5px 0;font-size:13px;color:#1a1a2e;font-weight:600;">${order.shippingAddress}</td>
                </tr>
                ${
                  order.notes
                    ? `<tr>
                  <td style="padding:5px 0;vertical-align:top;font-size:13px;color:#6b7280;font-weight:500;">Notes</td>
                  <td style="padding:5px 0;font-size:13px;color:#e67e22;font-weight:500;font-style:italic;">${order.notes}</td>
                </tr>`
                    : ""
                }
              </table>

              <!-- Order Items -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#1a1a2e;font-weight:700;border-bottom:2px solid #0f3460;padding-bottom:8px;">📦 Order Items</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8edf5;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <thead>
                  <tr style="background:#f8faff;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Unit Price</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Order Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border:1px solid #e8edf5;border-radius:8px;padding:20px;margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 20px;font-size:14px;color:#6b7280;">Subtotal</td>
                  <td style="padding:6px 20px;text-align:right;font-size:14px;color:#1a1a2e;font-weight:600;">${formatCurrency(order.subtotal, order.currency)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 20px;font-size:14px;color:#6b7280;">Shipping Fee</td>
                  <td style="padding:6px 20px;text-align:right;font-size:14px;color:#1a1a2e;font-weight:600;">${formatCurrency(order.shippingFee, order.currency)}</td>
                </tr>
                <tr style="border-top:2px solid #e8edf5;">
                  <td style="padding:12px 20px;font-size:16px;font-weight:700;color:#1a1a2e;">Total</td>
                  <td style="padding:12px 20px;text-align:right;font-size:20px;font-weight:800;color:#0f3460;">${formatCurrency(order.total, order.currency)}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8faff;padding:20px 40px;border-top:1px solid #e8edf5;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">This is an automated notification from <strong>BME Pharma</strong> order system.</p>
              <p style="margin:4px 0 0;font-size:11px;color:#d1d5db;">Received at ${new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" })} (Cairo Time)</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends an order notification email to the admin.
 * Falls back gracefully if env vars are missing or SMTP fails — the order is never blocked.
 */
export async function sendOrderNotificationEmail(
  order: OrderEmailData,
  adminEmail: string | null | undefined
): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
      "[Email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email notification."
    );
    return;
  }

  if (!adminEmail) {
    console.warn("[Email] No admin email configured in CompanyInfo — skipping.");
    return;
  }

  try {
    const transporter = createTransporter();

    const orderIdShort = order.id.slice(0, 8).toUpperCase();

    await transporter.sendMail({
      from: `"BME Pharma Orders" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🛒 New Order #${orderIdShort} — ${order.customerName} (${order.currency} ${order.total.toFixed(2)})`,
      html: buildOrderEmailHtml(order),
    });

    console.log(
      `[Email] Order notification sent to ${adminEmail} for order #${orderIdShort}`
    );
  } catch (error) {
    // Log but never crash the order creation flow
    console.error("[Email] Failed to send order notification:", error);
  }
}
