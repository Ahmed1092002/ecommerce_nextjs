"use client";

import { PaymentStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-300";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-300";
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "PARTIALLY_REFUNDED":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function PaymentStatusBadge({
  status,
  className = "",
}: PaymentStatusBadgeProps) {
  const statusString =
    typeof status === "string" ? status : PaymentStatus[status];
  const colorClass = getPaymentStatusColor(statusString);

  return (
    <Badge
      variant="outline"
      className={`${colorClass} font-semibold border ${className}`}
    >
      {statusString.replace(/_/g, " ")}
    </Badge>
  );
}
