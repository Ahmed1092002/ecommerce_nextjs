"use client";

import { OrderResponse } from "@/types/order";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import {
  formatPrice,
  formatDateTime,
  formatOrderNumber,
  canCancelOrder,
} from "@/utils/helpers";
import { Package, Calendar, DollarSign, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderCardProps {
  order: OrderResponse;
  onCancel?: (orderId: number) => void;
  isCanceling?: boolean;
}

export function OrderCard({
  order,
  onCancel,
  isCanceling = false,
}: OrderCardProps) {
  const canCancel = canCancelOrder(order.orderStatus.toString());
  const displayItems = order.items.slice(0, 3);
  const remainingCount = order.items.length - 3;

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200 border border-[var(--border)]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">
              {formatOrderNumber(order.orderNumber)}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
          </div>
          <OrderStatusBadge status={order.orderStatus} type="order" />
        </div>

        {/* Order Items Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Package className="w-4 h-4" />
            <span>
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border border-[var(--border)]"
              >
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="w-16 h-16 rounded-md bg-muted border border-[var(--border)] flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
          <DollarSign className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-xl font-bold text-primary ml-auto">
            {formatPrice(order.finalAmount)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link href={`/profile/orders/${order.id}`} className="flex-1">
            <Button variant="default" className="w-full gap-2">
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </Link>
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(order.id)}
              disabled={isCanceling}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
