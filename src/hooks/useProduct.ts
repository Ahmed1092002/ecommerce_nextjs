"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { CreateProductData } from "@/types/product";
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
  return {
    createProduct,
    Loading,
    error,
  };
}
