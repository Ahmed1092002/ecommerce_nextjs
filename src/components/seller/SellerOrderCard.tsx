"use client";

import { OrderItemResponse } from "@/types/order";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { formatPrice, formatDateTime } from "@/utils/helpers";
import { Package, Truck, CheckCircle } from "lucide-react";
import Image from "next/image";

interface SellerOrderCardProps {
  item: OrderItemResponse;
  onShip?: (itemId: number) => void;
  onDeliver?: (itemId: number) => void;
  isUpdating?: boolean;
}

export function SellerOrderCard({
  item,
  onShip,
  onDeliver,
  isUpdating = false,
}: SellerOrderCardProps) {
  const canShip = item.itemStatus.toString() === "PAID";
  const canDeliver = item.itemStatus.toString() === "SHIPPED";

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 border border-[var(--border)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Order Item #{item.id}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(item.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={item.itemStatus} type="item" />
        </div>

        {/* Product Info */}
        <div className="flex gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-[var(--border)]">
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
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold">{item.productName}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Qty: {item.quantity}</span>
              <span>•</span>
              <span>{formatPrice(item.priceAtPurchase)}</span>
            </div>
            {item.discountAtPurchase > 0 && (
              <p className="text-sm text-green-600">
                Discount: {item.discountAtPurchase}%
              </p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(item.totalPrice)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {canShip && onShip && (
            <Button
              variant="default"
              onClick={() => onShip(item.id)}
              disabled={isUpdating}
              className="flex-1 gap-2"
            >
              <Truck className="w-4 h-4" />
              Mark as Shipped
            </Button>
          )}
          {canDeliver && onDeliver && (
            <Button
              variant="default"
              onClick={() => onDeliver(item.id)}
              disabled={isUpdating}
              className="flex-1 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Delivered
            </Button>
          )}
          {!canShip && !canDeliver && (
            <p className="text-sm text-muted-foreground italic">
              No actions available for this status
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
