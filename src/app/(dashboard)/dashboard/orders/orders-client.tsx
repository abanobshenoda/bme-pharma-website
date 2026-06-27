"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Loader2,
  Printer,
} from "lucide-react";
import {
  updateOrderStatus,
  updatePaymentStatus,
} from "@/actions/order-actions";
import { toast } from "sonner";
import Image from "next/image";

// Reusing types roughly matching our Prisma schema
type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  shippingAddress: string;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  receiptImage?: string;
  notes?: string;
  items: OrderItem[];
};

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper formats
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Package className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge variant="default" className="bg-blue-500">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="default" className="bg-purple-500">
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Delivered
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string, method: string) => {
    if (status === "COMPLETED")
      return (
        <Badge variant="default" className="bg-green-500">
          Paid ({method})
        </Badge>
      );
    if (status === "FAILED") return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="secondary">Pending ({method})</Badge>;
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: string,
    type: "order" | "payment",
  ) => {
    setIsUpdating(true);
    let res: { success?: boolean; error?: string; data?: unknown } | undefined;
    if (type === "order") {
      res = await updateOrderStatus(orderId, newStatus);
    } else {
      res = await updatePaymentStatus(orderId, newStatus);
    }

    if (res?.success) {
      toast.success(`${type === "order" ? "Order" : "Payment"} status updated`);
      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                [type === "order" ? "orderStatus" : "paymentStatus"]: newStatus,
              }
            : o,
        ),
      );
    } else {
      toast.error("Failed to update status");
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Info</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-32 text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium text-sm flex items-center gap-2">
                      #{order.id.slice(0, 8)}
                    </div>
                    <div
                      className="text-xs text-muted-foreground mt-1"
                      suppressHydrationWarning
                    >
                      {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="font-bold mt-1 text-primary">
                      {formatPrice(order.total, order.currency)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.customerPhone}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.city}
                    </div>
                  </TableCell>

                  <TableCell>
                    {getPaymentStatusBadge(
                      order.paymentStatus,
                      order.paymentMethod,
                    )}
                  </TableCell>

                  <TableCell>
                    {getOrderStatusBadge(order.orderStatus)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={isUpdating}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem asChild>
                            <a
                              href={`/invoice/${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Printer className="w-4 h-4 mr-2" /> Print Invoice
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Order Status
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(
                                order.id,
                                "PROCESSING",
                                "order",
                              )
                            }
                          >
                            Mark as Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "SHIPPED", "order")
                            }
                          >
                            Mark as Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "DELIVERED", "order")
                            }
                          >
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "CANCELLED", "order")
                            }
                            className="text-red-600"
                          >
                            Cancel Order
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Payment Status
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(
                                order.id,
                                "COMPLETED",
                                "payment",
                              )
                            }
                          >
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(order.id, "FAILED", "payment")
                            }
                            className="text-red-600"
                          >
                            Mark as Failed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Order Details Modal */}
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details #{order.id}</DialogTitle>
                          <DialogDescription suppressHydrationWarning>
                            Placed on{" "}
                            {format(new Date(order.createdAt), "PPP 'at' p")}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6 py-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                                Customer Details
                              </h4>
                              <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                                <p>
                                  <span className="font-medium">Name:</span>{" "}
                                  {order.customerName}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {order.customerEmail}
                                </p>
                                <p>
                                  <span className="font-medium">Phone:</span>{" "}
                                  {order.customerPhone}
                                </p>
                                <p>
                                  <span className="font-medium">Address:</span>{" "}
                                  {order.shippingAddress}, {order.city}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                                Order Notes
                              </h4>
                              <div className="bg-muted p-4 rounded-lg text-sm">
                                {order.notes ? (
                                  <p>{order.notes}</p>
                                ) : (
                                  <p className="text-muted-foreground italic">
                                    No additional notes provided.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                                Payment Details
                              </h4>
                              <div className="bg-muted p-4 rounded-lg text-sm space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b">
                                  <span>Method:</span>
                                  <Badge variant="outline">
                                    {order.paymentMethod}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b">
                                  <span>Status:</span>
                                  {getPaymentStatusBadge(
                                    order.paymentStatus,
                                    order.paymentMethod,
                                  )}
                                </div>

                                {/* Show receipt image if MANUAL transfer */}
                                {order.paymentMethod === "MANUAL" &&
                                  order.receiptImage && (
                                    <div className="pt-2">
                                      <span className="block mb-2 font-medium">
                                        Transfer Receipt:
                                      </span>
                                      <a
                                        href={order.receiptImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block relative w-full h-32 rounded-md overflow-hidden border hover:opacity-90 transition-opacity"
                                      >
                                        <Image
                                          src={order.receiptImage}
                                          alt="Receipt"
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                          <span className="text-white text-xs font-bold flex items-center gap-1">
                                            <Eye className="w-3 h-3" /> Click to
                                            enlarge
                                          </span>
                                        </div>
                                      </a>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-4">
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                            Order Items
                          </h4>
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead className="text-center">
                                    Qty
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Price
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Total
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                      {item.productName}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatPrice(
                                        item.unitPrice,
                                        order.currency,
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      {formatPrice(
                                        item.totalPrice,
                                        order.currency,
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
