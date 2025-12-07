"use client";
import { useState } from "react";
import { Product } from "@/types/product";
import { toast } from "react-toastify";
import { api } from "@/lib/api-client";
import { AddToCartData, Cart } from "@/types/cart";
export function useCart() {
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function addToCart(addToCartData: AddToCartData) {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/customer/cart/AddItem", addToCartData);
      toast.success("Product added to cart!");
      return response;
    } catch (error) {
      let errorMessage =
        "An error occurred while adding the product to the cart.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function getCart() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Cart>("/customer/cart/GetCart");
      return response?.cart;
    } catch (error) {
      let errorMessage = "An error occurred while fetching the cart.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(cartItemId: number) {
    try {
      setLoading(true);
      setError(null);
      const response = await api.delete(`/customer/cart/remove/${cartItemId}`);
      toast.success("Product removed from cart!");
      return response;
    } catch (error) {
      let errorMessage =
        "An error occurred while removing the product from the cart.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function updateCartQuantity(cartItemId: number, quantity: number) {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/customer/cart/update/${cartItemId}`, {
        quantity,
      });
      toast.success("Product quantity updated!");
      return response;
    } catch (error) {
      let errorMessage =
        "An error occurred while updating the product quantity.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  async function clearCart() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.delete("/customer/cart/clear");
      toast.success("Cart cleared!");
      return response;
    } catch (error) {
      let errorMessage = "An error occurred while clearing the cart.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    error,
  };
}
