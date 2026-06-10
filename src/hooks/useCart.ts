"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api-client";
import { AddToCartData, Cart, CartData } from "@/types/cart";
import { handleHookError } from "./utils/hook-utils";
import { useAsyncOperation } from "./useAsyncOperation";

export interface UseCartReturn {
  loading: boolean;
  error: string | null;
  addToCart: (data: AddToCartData) => Promise<void>;
  getCart: () => Promise<CartData>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const { loading, error, withLoadingAndError } = useAsyncOperation();

  async function addToCart(addToCartData: AddToCartData): Promise<void> {
    return withLoadingAndError(async () => {
      await api.post("/customer/cart/AddItem", addToCartData);
    }, "Product added to cart!");
  }

  async function getCart(): Promise<CartData> {
    return withLoadingAndError(async () => {
      const response = await api.get<Cart>("/customer/cart/GetCart");
      // API returns the full Cart object with nested cart property
      return response.cart;
    });
  }

  async function removeFromCart(cartItemId: number): Promise<void> {
    return withLoadingAndError(async () => {
      await api.delete(`/customer/cart/remove/${cartItemId}`);
    }, "Product removed from cart!");
  }

  async function updateCartQuantity(
    cartItemId: number,
    quantity: number
  ): Promise<void> {
    return withLoadingAndError(async () => {
      await api.put(`/customer/cart/update/${cartItemId}`, {
        quantity,
      });
    }, "Product quantity updated!");
  }

  async function clearCart(): Promise<void> {
    return withLoadingAndError(async () => {
      await api.delete("/customer/cart/clear");
    }, "Cart cleared!");
  }

  return {
    loading,
    error,
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };
}
