"use client";

import { useEffect, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { OrderListResponse, OrderResponse, OrderStatus } from "@/types/order";
import { OrderCard } from "@/components/customer/OrderCard";
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
import { ShoppingBag, Home, ChevronRight, Filter, Search } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/shared/modal";

export default function OrdersPage() {
  const { getOrders, cancelOrder } = useOrder();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [cancelingOrderId, setCancelingOrderId] = useState<number | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pageSize = 6;

  async function loadOrders() {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        page,
        size: pageSize,
        sortedColumn: sortBy,
        ascending: false,
      };

      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }

      const response = await getOrders(params);
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

  async function handleCancelOrder(orderId: number) {
    setCancelingOrderId(orderId);
    try {
      await cancelOrder(String(orderId));
      toast.success("Order canceled successfully");
      await loadOrders(); // Reload orders
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    } finally {
      setCancelingOrderId(null);
      setOrderToCancel(null);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, sortBy]);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-[var(--border)] mb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">My Orders</span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-1">
                  My Orders
                </h1>
                <p className="text-lg text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "order" : "orders"} total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Filters */}
        <Card className="p-6 mb-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filter Orders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search by Order Number</label>
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
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-[var(--border)]">
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-[var(--border)]">
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="finalAmount">Amount</SelectItem>
                  <SelectItem value="orderStatus">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">No orders found</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {statusFilter !== "ALL" || searchQuery
                ? "No orders match your filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            <Button onClick={() => (window.location.href = "/product")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {orders
                .filter((order) =>
                  searchQuery === ""
                    ? true
                    : order.orderNumber
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                )
                .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={(id) => setOrderToCancel(id)}
                  isCanceling={cancelingOrderId === order.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
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
                          onClick={(e) => {
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
                      onClick={(e) => {
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

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={orderToCancel !== null}
        onClose={() => setOrderToCancel(null)}
        title="Cancel Order"
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setOrderToCancel(null)}
              className="w-full"
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={() => orderToCancel && handleCancelOrder(orderToCancel)}
              className="w-full"
              disabled={cancelingOrderId !== null}
            >
              {cancelingOrderId ? "Canceling..." : "Cancel Order"}
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
