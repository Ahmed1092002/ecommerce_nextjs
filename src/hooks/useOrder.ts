"use client";

import { api } from "@/lib/api-client";
import {
  CheckoutRequest,
  OrderItemResponse,
  OrderItemStatus,
  OrderListResponse,
  OrderResponse,
} from "@/types/order";
import { QueryParams } from "./types/hook-types";
import { buildQueryString } from "./utils/hook-utils";
import { useAsyncOperation } from "./useAsyncOperation";

export interface UseOrderReturn {
  loading: boolean;
  error: string | null;
  handleCheckOut: (data: CheckoutRequest) => Promise<OrderResponse>;
  getOrders: (params?: QueryParams) => Promise<OrderListResponse>;
  getOrderById: (id: string) => Promise<OrderResponse>;
  cancelOrder: (id: string) => Promise<Map<string, string>>;
  shipAllItemsInOrder: (orderId: number) => Promise<Map<string, string>>;
  shipOrderItem: (itemId: number) => Promise<Map<string, string>>;
  deliverOrderItem: (itemId: number) => Promise<Map<string, string>>;
  getOrdersBySeller: (
    params?: QueryParams,
    status?: string | null
  ) => Promise<OrderListResponse>;
  getSellerOrderItems: (orderId: number) => Promise<OrderResponse>;
}

export const useOrder = (): UseOrderReturn => {
  const { loading, error, withLoadingAndError } = useAsyncOperation();

  // Function for customer order checkout
  async function handleCheckOut(
    checkoutRequest: CheckoutRequest
  ): Promise<OrderResponse> {
    return withLoadingAndError(async () => {
      const response = await api.post<OrderResponse>(
        "/customer/orders/checkout",
        checkoutRequest
      );
      return response;
    }, "Order placed successfully!");
  }

  async function getOrders(
    params?: QueryParams,
    search?: string | null
  ): Promise<OrderListResponse> {
    return withLoadingAndError(async () => {
      const paramsd = {
        ...params,
        search: search?.toString(),
      };
      const query = buildQueryString(paramsd);
      const response = await api.get<OrderListResponse>(
        `/customer/orders${query}`
      );
      return response;
    });
  }

  async function getOrderById(id: string): Promise<OrderResponse> {
    return withLoadingAndError(async () => {
      const response = await api.get<OrderResponse>(`/customer/orders/${id}`);
      return response;
    });
  }

  async function cancelOrder(id: string): Promise<Map<string, string>> {
    return withLoadingAndError(async () => {
      const response = await api.put<Map<string, string>>(
        `/customer/orders/${id}/cancel`,
        {} // Empty body for PUT request
      );
      return response;
    }, "Order cancelled successfully!");
  }
  //function for seller

  async function getOrdersBySeller(
    params?: QueryParams,
    status?: string | null,
    search?: string | null
  ): Promise<OrderListResponse> {
    return withLoadingAndError(async () => {
      const paramsd = {
        ...params,
        status: status?.toString(),
        search: search?.toString(),
      };
      const query = buildQueryString(paramsd);

      const response = await api.get<OrderListResponse>(
        `/seller/orders${query}`
      );
      return response;
    });
  }

  async function getSellerOrderItems(orderId: number): Promise<OrderResponse> {
    return withLoadingAndError(async () => {
      const response = await api.get<OrderResponse>(
        `/seller/orders/${orderId}`
      );
      return response;
    });
  }
  async function shipAllItemsInOrder(
    orderId: number
  ): Promise<Map<string, string>> {
    return withLoadingAndError(async () => {
      const response = await api.put<Map<string, string>>(
        `/seller/orders/${orderId}/ship`,
        {} // Empty body for PUT request
      );
      return response;
    }, "All items in order shipped successfully!");
  }
  async function shipOrderItem(itemId: number): Promise<Map<string, string>> {
    return withLoadingAndError(async () => {
      const response = await api.put<Map<string, string>>(
        `/seller/orders/items/${itemId}/ship`,
        {} // Empty body for PUT request
      );
      return response;
    }, "Order item shipped successfully!");
  }

  async function deliverOrderItem(
    itemId: number
  ): Promise<Map<string, string>> {
    return withLoadingAndError(async () => {
      const response = await api.put<Map<string, string>>(
        `/seller/orders/items/${itemId}/deliver`,
        {} // Empty body for PUT request
      );
      return response;
    }, "Order item delivered successfully!");
  }

  return {
    loading,
    error,
    handleCheckOut,
    getOrders,
    getOrderById,
    cancelOrder,
    getOrdersBySeller,
    getSellerOrderItems,
    shipAllItemsInOrder,
    shipOrderItem,
    deliverOrderItem,
  };
};
