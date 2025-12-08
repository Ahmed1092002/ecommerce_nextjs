"use client";

import { OrderStatus, OrderItemStatus } from "@/types/order";
import { getOrderStatusColor, getOrderItemStatusColor } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus | OrderItemStatus;
  type?: "order" | "item";
  className?: string;
}

export function OrderStatusBadge({
  status,
  type = "order",
  className = "",
}: OrderStatusBadgeProps) {
  const statusString =
    typeof status === "string" ? status : OrderStatus[status];
  const colorClass =
    type === "order"
      ? getOrderStatusColor(statusString)
      : getOrderItemStatusColor(statusString);

  return (
    <Badge
      variant="outline"
      className={`${colorClass} font-semibold border ${className}`}
    >
      {statusString}
    </Badge>
  );
}
