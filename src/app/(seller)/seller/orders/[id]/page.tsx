"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { OrderResponse } from "@/types/order";
import { Loading } from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatPrice, formatDateTime } from "@/utils/helpers";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Calendar,
  DollarSign,
  Hash,
} from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/shared/modal";
import Image from "next/image";

export default function SellerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getSellerOrderItems, shipOrderItem, deliverOrderItem } = useOrder();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    itemId: number | null;
    action: "ship" | "deliver" | null;
    itemName: string;
  }>({ isOpen: false, itemId: null, action: null, itemName: "" });

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function loadOrder() {
    setLoading(true);
    try {
      const orderData = await getSellerOrderItems(Number(orderId));
      setOrder(orderData);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleShipItem(itemId: number) {
    setUpdatingItemId(itemId);
    try {
      await shipOrderItem(itemId);
      toast.success("Item marked as shipped");
      await loadOrder();
    } catch (error) {
      toast.error("Failed to ship item");
      console.error(error);
    } finally {
      setUpdatingItemId(null);
      setActionModal({
        isOpen: false,
        itemId: null,
        action: null,
        itemName: "",
      });
    }
  }

  async function handleDeliverItem(itemId: number) {
    setUpdatingItemId(itemId);
    try {
      await deliverOrderItem(itemId);
      toast.success("Item marked as delivered");
      await loadOrder();
    } catch (error) {
      toast.error("Failed to deliver item");
      console.error(error);
    } finally {
      setUpdatingItemId(null);
      setActionModal({
        isOpen: false,
        itemId: null,
        action: null,
        itemName: "",
      });
    }
  }

  function openActionModal(
    itemId: number,
    action: "ship" | "deliver",
    itemName: string
  ) {
    setActionModal({ isOpen: true, itemId, action, itemName });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!order || order?.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/seller/orders")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        <Card className="p-8 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Items Found</h2>
          <p className="text-muted-foreground">
            This order doesn't contain any items from your store.
          </p>
        </Card>
      </div>
    );
  }

  // Get order details
  const firstItem = order?.items[0];
  const totalItemsValue =
    order?.items.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/seller/orders")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Details</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="w-4 h-4" />
              <span>Order #{orderId}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Order Date</p>
            <p className="font-medium">
              {formatDateTime(firstItem?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <Card className="p-6 mb-6 border-2 border-[var(--border)]">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-lg font-semibold">{order?.items.length}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-lg font-semibold text-green-600">
                {formatPrice(totalItemsValue)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-lg font-semibold">
                {new Date(firstItem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Items in this Order</h2>
        {order?.items.map((item) => {
          const canShip = item.itemStatus.toString() === "PAID";
          const canDeliver = item.itemStatus.toString() === "SHIPPED";
          const isProcessing = updatingItemId === item.id;

          return (
            <Card
              key={item.id}
              className="p-6 hover:shadow-md transition-shadow  border-[var(--border)]"
            >
              <div className="space-y-4">
                {/* Item Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Item #{item.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <OrderStatusBadge status={item.itemStatus} type="item" />
                </div>

                {/* Product Details */}
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-[var(--border)]">
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

                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-lg">
                      {item.productName}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">
                          {formatPrice(item.priceAtPurchase)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Discount</p>
                        <p className="font-medium text-green-600">
                          -{formatPrice(item.discountAtPurchase)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold text-lg">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {(canShip || canDeliver) && (
                  <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                    {canShip && (
                      <Button
                        onClick={() =>
                          openActionModal(item.id, "ship", item.productName)
                        }
                        disabled={isProcessing}
                        className="flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        {isProcessing ? "Processing..." : "Mark as Shipped"}
                      </Button>
                    )}
                    {canDeliver && (
                      <Button
                        onClick={() =>
                          openActionModal(item.id, "deliver", item.productName)
                        }
                        disabled={isProcessing}
                        variant="default"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isProcessing ? "Processing..." : "Mark as Delivered"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() =>
          setActionModal({
            isOpen: false,
            itemId: null,
            action: null,
            itemName: "",
          })
        }
        title={`Confirm ${
          actionModal.action === "ship" ? "Shipment" : "Delivery"
        }`}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to mark{" "}
            <strong>{actionModal.itemName}</strong> as{" "}
            {actionModal.action === "ship" ? "shipped" : "delivered"}?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() =>
                setActionModal({
                  isOpen: false,
                  itemId: null,
                  action: null,
                  itemName: "",
                })
              }
              disabled={updatingItemId !== null}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (actionModal.itemId && actionModal.action === "ship") {
                  handleShipItem(actionModal.itemId);
                } else if (
                  actionModal.itemId &&
                  actionModal.action === "deliver"
                ) {
                  handleDeliverItem(actionModal.itemId);
                }
              }}
              disabled={updatingItemId !== null}
              className={
                actionModal.action === "deliver"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {updatingItemId !== null ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
