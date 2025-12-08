export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};
export function calculateFinalPrice(price: number, discount: number): number {
  const nPrice = Number(price) || 0;
  const nDiscount = Number(discount) || 0;

  if (!nPrice) return 0;
  if (!nDiscount) return nPrice;

  const boundedDiscount = Math.min(Math.max(nDiscount, 0), 100);
  const discountAmount = (nPrice * boundedDiscount) / 100;
  const total = nPrice - discountAmount;

  return Math.max(0, total);
}

// Order-related utility functions
export const formatOrderNumber = (orderNumber: string): string => {
  return `#${orderNumber}`;
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const getOrderStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    PAID: "bg-blue-100 text-blue-800 border-blue-300",
    SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
    DELIVERED: "bg-green-100 text-green-800 border-green-300",
    CANCELED: "bg-red-100 text-red-800 border-red-300",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const getOrderItemStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    PAID: "bg-blue-100 text-blue-800 border-blue-300",
    SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
    DELIVERED: "bg-green-100 text-green-800 border-green-300",
    CANCELED: "bg-red-100 text-red-800 border-red-300",
    RETURNED: "bg-orange-100 text-orange-800 border-orange-300",
    REFUNDED: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const canCancelOrder = (status: string): boolean => {
  return status === "PENDING" || status === "PAID";
};

export const canUpdateItemStatus = (
  currentStatus: string,
  newStatus: string
): boolean => {
  const statusFlow: Record<string, string[]> = {
    PENDING: ["PAID", "CANCELED"],
    PAID: ["SHIPPED", "CANCELED"],
    SHIPPED: ["DELIVERED", "RETURNED"],
    DELIVERED: ["RETURNED"],
    CANCELED: [],
    RETURNED: ["REFUNDED"],
    REFUNDED: [],
  };
  return statusFlow[currentStatus]?.includes(newStatus) || false;
};
