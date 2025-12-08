"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { OrderResponse } from "@/types/order";
import { Loading } from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ShoppingCart,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Eye,
  Calendar,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatPrice, formatDateTime } from "@/utils/helpers";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { PaymentStatusBadge } from "@/components/shared/PaymentStatusBadge";

export default function SellerOrdersPage() {
  const router = useRouter();
  const { getOrdersBySeller } = useOrder();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pageSize = 9;

  async function loadOrders() {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        size: pageSize,
      };

      const status =
        statusFilter && statusFilter !== "ALL" ? statusFilter : undefined;

      const response = await getOrdersBySeller(params, status);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function viewOrderDetails(orderId: number) {
    router.push(`/seller/orders/${orderId}`);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(
      (order: OrderResponse) => order.orderStatus.toString() === "PENDING"
    ).length,
    paid: orders.filter(
      (order: OrderResponse) => order.orderStatus.toString() === "PAID"
    ).length,
    shipped: orders.filter(
      (order: OrderResponse) => order.orderStatus.toString() === "SHIPPED"
    ).length,
    delivered: orders.filter(
      (order: OrderResponse) => order.orderStatus.toString() === "DELIVERED"
    ).length,
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Order Management
        </h1>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 rounded-full p-2">
              <Package className="w-5 h-5 text-yellow-800" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <CheckCircle className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold">{stats.paid}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Truck className="w-5 h-5 text-purple-800" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipped</p>
              <p className="text-2xl font-bold">{stats.shipped}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <Package className="w-5 h-5 text-green-800" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{stats.delivered}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filter Orders</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Search by Order Number
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-[var(--border)] bg-amber-50">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-3">No orders found</h2>
          <p className="text-lg text-muted-foreground">
            {statusFilter !== "ALL" || searchQuery
              ? "No orders match your filter criteria"
              : "You don't have any orders yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders
              .filter((order) =>
                searchQuery === ""
                  ? true
                  : order.orderNumber
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
              )
              .map((order: OrderResponse) => (
                <Card
                  key={order.id}
                  className="p-6 hover:shadow-md transition-shadow  border-[var(--border)]"
                >
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">
                            Order #{order.orderNumber}
                          </h3>
                          <OrderStatusBadge
                            status={order.orderStatus}
                            type="order"
                          />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(order.finalAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="text-sm font-medium mb-3">
                        Items in this order:
                      </p>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 text-sm"
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1">{item.productName}</span>
                            <span className="text-muted-foreground">
                              x{item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-muted-foreground pl-7">
                            +{order.items.length - 3} more{" "}
                            {order.items.length - 3 === 1 ? "item" : "items"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                      <Button
                        variant="default"
                        onClick={() => viewOrderDetails(order.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    aria-disabled={page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
