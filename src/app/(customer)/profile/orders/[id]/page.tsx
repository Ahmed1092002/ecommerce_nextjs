"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { OrderResponse } from "@/types/order";
import { Loading } from "@/components/shared/Loading";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { PaymentStatusBadge } from "@/components/shared/PaymentStatusBadge";
import { OrderTimeline } from "@/components/shared/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  formatDateTime,
  formatOrderNumber,
  canCancelOrder,
} from "@/utils/helpers";
import {
  Home,
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/shared/modal";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrderById, cancelOrder } = useOrder();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const orderId = params.id as string;

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [orderId, getOrderById]);

  async function handleCancelOrder() {
    if (!order) return;
    setCanceling(true);
    try {
      await cancelOrder(String(order.id));
      toast.success("Order canceled successfully");
      await loadOrder(); // Reload order
      setShowCancelModal(false);
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    } finally {
      setCanceling(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Button onClick={() => router.push("/profile/orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const canCancel = canCancelOrder(order.orderStatus.toString());

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-[var(--border)] mb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <Link href="/profile/orders" className="hover:text-foreground">
              My Orders
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {formatOrderNumber(order.orderNumber)}
            </span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Order {formatOrderNumber(order.orderNumber)}
              </h1>
              <p className="text-lg text-muted-foreground">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.orderStatus} type="order" />
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/profile/orders")}
            className="mt-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <OrderTimeline order={order} />

            {/* Order Items */}
            <Card className="p-6 border border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-background border border-[var(--border)]">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>Price: {formatPrice(item.priceAtPurchase)}</span>
                        {item.discountAtPurchase > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">
                              Discount: {item.discountAtPurchase}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <OrderStatusBadge
                          status={item.itemStatus}
                          type="item"
                        />
                        <span className="text-lg font-bold">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sold by: {item.sellerBusinessName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card className="p-6 border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Shipping Address</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2">{order.shippingAddress.phone}</p>
                </div>
              </Card>

              {/* Billing Address */}
              <Card className="p-6 border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Billing Address</h3>
                </div>
                <div className="space-y-1 text-sm">
                  \ <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  <p className="pt-2">{order.billingAddress.phone}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 border border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                {/* Payment Method */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>

                <Separator />

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                {/* Discount */}
                {order.totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -{formatPrice(order.totalDiscount)}
                    </span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatPrice(order.finalAmount)}
                  </span>
                </div>

                {/* Cancel Order Button */}
                {canCancel && (
                  <>
                    <Separator />
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => setShowCancelModal(true)}
                      disabled={canceling}
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="w-full"
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              className="w-full"
              disabled={canceling}
            >
              {canceling ? "Canceling..." : "Cancel Order"}
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to cancel order{" "}
          {formatOrderNumber(order.orderNumber)}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
