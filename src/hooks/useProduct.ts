"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { CreateProductData, Product } from "@/types/product";
import { toast } from "react-toastify";
export function useProduct() {
  const [Loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  async function createProduct(data: CreateProductData) {
    // Implementation for creating a product
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/seller/products/CreateProduct", data);
      toast.success("Product created successfully!");
      router.push("/seller/product");
      return response;
    } catch (error) {
      let errorMessage = "An error occurred while creating the product.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  type SearchProductsParams = Record<
    string,
    string | number | boolean | undefined
  >;

  async function getSellerProducts(params?: SearchProductsParams) {
    let query = "";
    if (params) {
      const entries = Object.entries(params).filter(([, v]) => v !== undefined);
      if (entries.length > 0) {
        const searchParams = new URLSearchParams();
        for (const [k, v] of entries) {
          searchParams.append(k, String(v));
        }
        query = `?${searchParams.toString()}`;
      }
    }

    // Use the same base path as other seller product calls and append query string
    const endpoint = `/seller/products/GetProducts${query}`;
    const response = await api.get<Product>(endpoint);
    return response;
  }
  async function getProductById(id: string) {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Product>(`/products/getProductByID/${id}`);
      return response;
    } catch (error) {
      let errorMessage = "An error occurred while fetching the product.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  async function updateProduct(data: Product) {
    // Implementation for updating a product
    try {
      setLoading(true);
      setError(null);
      const response = await api.put("/seller/products/updateproduct", data);
      toast.success("Product updated successfully!");
      router.push("/seller/product");
      return response;
    } catch (error) {
      let errorMessage = "An error occurred while updating the product.";
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
    createProduct,
    getSellerProducts,
    getProductById,
    updateProduct,
    Loading,
    error,
  };
}
