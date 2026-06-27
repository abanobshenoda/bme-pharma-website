import { getOrders } from "@/actions/order-actions";
import { OrdersClient } from "./orders-client";

export const metadata = {
  title: "Orders Management | BME Pharma Dashboard",
  description: "View and manage customer orders",
};

export default async function OrdersPage() {
  const { data: orders = [], success, error } = await getOrders();

  if (!success) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2>Error loading orders</h2>
        <p>{error}</p>
      </div>
    );
  }

  return <OrdersClient initialOrders={orders as any[]} />;
}
