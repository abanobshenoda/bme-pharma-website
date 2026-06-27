import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import prisma from "@/lib/db";
import { Order } from "@/generated/prisma/client";

export default async function DashboardPage() {
  // Fetch statistics in parallel
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    deliveredOrders,
    pendingOrders,
    revenueData,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    prisma.order.count({
      where: { orderStatus: { in: ["PENDING", "PROCESSING", "SHIPPED"] } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      // Calculate revenue from Delivered orders (or COMPLETED payment status)
      where: { orderStatus: "DELIVERED" },
    }),
    // Fetch last 5 orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = revenueData._sum.total || 0;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMoney(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From delivered orders
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground flex gap-3 mt-1">
              <span className="text-green-500 font-medium">
                {deliveredOrders} Delivered
              </span>
              <span className="text-amber-500 font-medium">
                {pendingOrders} Pending
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items in library</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col items-center justify-center p-6 text-center">
          <TrendingUp className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            Sales Activity
          </h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mt-2">
            More graphical charts and analytics can be integrated here to show
            sales trends over time.
          </p>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A quick look at the latest {recentOrders.length} orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No orders found.
                </p>
              ) : (
                recentOrders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {order.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.currency || "USD",
                        }).format(order.total)}
                      </div>
                      <div className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium mt-1 inline-block">
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
