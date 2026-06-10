import { useAsyncOperation } from "./useAsyncOperation";
import { api } from "../lib/api-client";
import { Product, ProductData } from "@/types/product";
import { buildQueryString } from "./utils/hook-utils";

export interface WishlistItem extends ProductData {
  wishlistId?: number;
}

export interface useWishlistReturn {
  loading: boolean;
  error: string | null;
  addToWishlist: (productId: number) => Promise<any>;
  removeFromWishlist: (productId: number) => Promise<any>;
  getWishlistItems: (page: number) => Promise<{
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    data: WishlistItem[];
  }>;
}

export function useWishlist(): useWishlistReturn {
  const { loading, error, withLoadingAndError } = useAsyncOperation();

  async function addToWishlist(productId: number): Promise<any> {
    return withLoadingAndError(async () => {
      const response = await api.post(
        `/customer/wishlist/add/${productId}`,
        {}
      );
      return response;
    }, "Product added to wishlist!");
  }

  async function removeFromWishlist(productId: number): Promise<any> {
    return withLoadingAndError(async () => {
      const response = await api.delete(
        `/customer/wishlist/remove/${productId}`
      );
      return response;
    }, "Product removed from wishlist!");
  }

  async function getWishlistItems(page: number): Promise<{
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    data: WishlistItem[];
  }> {
    return withLoadingAndError(async () => {
      const params = {
        page,
      };
      const query = buildQueryString(params);
      const response = await api.get<{
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        totalElements: number;
        data: WishlistItem[];
      }>(`/customer/wishlist/items${query}`);
      return response;
    }, "");
  }

  return {
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    getWishlistItems,
  };
}
