import { AddressData } from "./address";

export enum OrderItemStatus {
  PENDING, // Order created, waiting for payment
  PAID, // Payment completed, ready to ship
  SHIPPED, // Shipped to customer
  DELIVERED, // Delivered to customer
  CANCELED, // Canceled by customer/seller
  RETURNED, // Returned by customer
  REFUNDED, // Refunded
}
export enum OrderStatus {
  PENDING,
  PAID,
  SHIPPED,
  DELIVERED,
  CANCELED,
}

export enum PaymentMethod {
  CREDIT_CARD,
  DEBIT_CARD,
  PAYPAL,
  CASH_ON_DELIVERY,
  BANK_TRANSFER,
}

export enum PaymentStatus {
  PENDING,
  COMPLETED,
  FAILED,
  REFUNDED,
  PARTIALLY_REFUNDED,
}

export interface CheckoutRequest {
  shippingAddressId: number;
  billingAddressId: number;
  paymentMethod: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  sellerId: number;
  sellerBusinessName: string;
  quantity: number;
  priceAtPurchase: number;
  discountAtPurchase: number;
  totalPrice: number;
  itemStatus: OrderItemStatus;
  createdAt: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  shippingAddress: AddressData;
  billingAddress: AddressData;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
  paidAt: string;
  shippedAt: string;
  deliveredAt: string;
}

export interface OrderListResponse {
  orders: OrderResponse[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}
