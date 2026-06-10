"use client";

import { OrderResponse } from "@/types/order";
import { formatDateTime } from "@/utils/helpers";
import {
  Check,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface OrderTimelineProps {
  order: OrderResponse;
}

interface TimelineStep {
  label: string;
  date?: string;
  completed: boolean;
  current: boolean;
  icon: React.ReactNode;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const isCanceled = order.orderStatus.toString() === "CANCELED";

  const steps: TimelineStep[] = [
    {
      label: "Order Placed",
      date: order.createdAt,
      completed: true,
      current: false,
      icon: <Check className="w-5 h-5" />,
    },
    {
      label: "Payment Confirmed",
      date: order.paidAt,
      completed: order.paidAt !== null && !isCanceled,
      current: order.orderStatus.toString() === "PENDING" && !isCanceled,
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      label: "Shipped",
      date: order.shippedAt,
      completed: order.shippedAt !== null && !isCanceled,
      current: order.orderStatus.toString() === "PAID" && !isCanceled,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      label: "Delivered",
      date: order.deliveredAt,
      completed: order.deliveredAt !== null && !isCanceled,
      current: order.orderStatus.toString() === "SHIPPED" && !isCanceled,
      icon: <Package className="w-5 h-5" />,
    },
  ];

  if (isCanceled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-800">
          <div className="bg-red-100 rounded-full p-2">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Order Canceled</h3>
            <p className="text-sm text-red-600">
              This order was canceled on {formatDateTime(order.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-[var(--border)] rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Icon circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.current
                    ? "bg-background border-primary text-primary animate-pulse"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {step.completed ? (
                  step.icon
                ) : step.current ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <h4
                  className={`font-semibold ${
                    step.completed || step.current
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </h4>
                {step.date && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDateTime(step.date)}
                  </p>
                )}
                {step.current && !step.date && (
                  <p className="text-sm text-primary mt-1">In Progress</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
