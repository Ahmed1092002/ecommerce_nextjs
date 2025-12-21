"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import {
  CreateProductData,
  Product,
  ProductData,
  UpdateProductData,
} from "@/types/product";
import { SearchParams } from "./types/hook-types";
import { buildQueryString } from "./utils/hook-utils";
import { useAsyncOperation } from "./useAsyncOperation";

export interface UseProductReturn {
  loading: boolean;
  error: string | null;
  createProduct: (data: CreateProductData) => Promise<Product>;
  getSellerProducts: (params?: SearchParams) => Promise<Product>;
  getCustomerProducts: (params?: SearchParams) => Promise<Product>;
  getProductById: (id: string) => Promise<ProductData>;
  updateProduct: (data: UpdateProductData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  bestSellers: () => Promise<ProductData[]>;
}

export function useProduct(): UseProductReturn {
  const router = useRouter();
  const { loading, error, withLoadingAndError } = useAsyncOperation();

  async function createProduct(data: CreateProductData): Promise<Product> {
    return withLoadingAndError(async () => {
      const response = await api.post<Product>(
        "/seller/products/CreateProduct",
        data
      );
      router.push("/seller/product");
      return response;
    }, "Product created successfully!");
  }

  async function getSellerProducts(params?: SearchParams): Promise<Product> {
    return withLoadingAndError(async () => {
      const query = buildQueryString(params);
      const endpoint = `/seller/products/GetProducts${query}`;
      const response = await api.get<Product>(endpoint);
      return response;
    });
  }

  async function getCustomerProducts(params?: SearchParams): Promise<Product> {
    return withLoadingAndError(async () => {
      const query = buildQueryString(params);
      const endpoint = `/products/GetProducts${query}`;
      const response = await api.get<Product>(endpoint);
      return response;
    });
  }

  async function getProductById(id: string): Promise<ProductData> {
    return withLoadingAndError(async () => {
      const response = await api.get<ProductData>(`/products/getProductByID/${id}`);
      return response;
    });
  }

  async function updateProduct(data: UpdateProductData): Promise<Product> {
    return withLoadingAndError(async () => {
      const response = await api.put<Product>(
        "/seller/products/updateproduct",
        data
      );
      router.push("/seller/product");
      return response;
    }, "Product updated successfully!");
  }

  async function deleteProduct(id: number): Promise<void> {
    return withLoadingAndError(async () => {
      await api.delete(`/seller/products/DeleteProduct/${id}`);
      router.push("/seller/product");
    }, "Product deleted successfully!");
  }
  async function bestSellers(): Promise<ProductData[]> {
    return withLoadingAndError(async () => {
      const response = await api.get<ProductData[]>(`/products/bestSellers`);
      return response;
    }, "Fetched best sellers successfully!");
  }

  return {
    loading,
    error,
    createProduct,
    getSellerProducts,
    getCustomerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    bestSellers,
  };
}
