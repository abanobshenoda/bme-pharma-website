import { getOrderById } from "@/actions/order-actions";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { PrintButton } from "./print-button";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { data: order, success } = await getOrderById(resolvedParams.id);

  if (!success || !order) {
    return notFound();
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="print:hidden mb-8 flex justify-end">
          <PrintButton />
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">
              Date: {format(new Date(order.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          <div className="text-right">
            <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-2xl ml-auto mb-2">
              B
            </div>
            <h2 className="text-xl font-bold">BME Pharma</h2>
            <p className="text-sm text-gray-600">Cairo, Egypt</p>
            <p className="text-sm text-gray-600">contact@bmepharma.com</p>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Billed To
            </h3>
            <p className="font-bold text-lg">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
            <p className="text-gray-600">{order.customerPhone}</p>
            <p className="text-gray-600 mt-2">{order.shippingAddress}</p>
            <p className="text-gray-600">{order.city}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Payment Details
            </h3>
            <p className="text-gray-600">
              <span className="font-medium text-black">Method:</span>{" "}
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Manual Transfer"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-black">Status:</span>{" "}
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-bold text-gray-600 uppercase text-sm">
                  Item Description
                </th>
                <th className="py-3 px-4 font-bold text-gray-600 uppercase text-sm text-center">
                  Qty
                </th>
                <th className="py-3 px-4 font-bold text-gray-600 uppercase text-sm text-right">
                  Rate
                </th>
                <th className="py-3 px-4 font-bold text-gray-600 uppercase text-sm text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    {formatPrice(item.unitPrice, order.currency)}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatPrice(item.totalPrice, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Box */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-3 text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-600">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingFee, order.currency)}</span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 font-bold text-xl text-primary">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          <p>Thank you for shopping with BME Pharma.</p>
          <p>If you have any questions concerning this invoice, contact us.</p>
        </div>
      </div>
    </div>
  );
}
