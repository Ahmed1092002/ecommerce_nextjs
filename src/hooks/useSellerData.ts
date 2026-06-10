import { QueryParams } from "./types/hook-types";
import { Loading } from "@/components/shared/Loading";

import { api } from "@/lib/api-client";
import { useAsyncOperation } from "./useAsyncOperation";
interface useSellerDataProps {
  loading: boolean;
  error: string | null;
  fetchSellerStats: () => Promise<SellerStat>;
  fetchSellerAnalytics: (params: {
    startDate: string;
    endDate: string;
  }) => Promise<SellerAnalytics>;
}
import { SellerAnalytics, SellerStat } from "@/types/sellerStat";
export function useSellerData(): useSellerDataProps {
  const { loading, error, withLoadingAndError } = useAsyncOperation();
  async function fetchSellerStats() {
    return withLoadingAndError(async () => {
      const res = await api.get<SellerStat>("/seller/profile/stats");
      return res;
    });
  }
  async function fetchSellerAnalytics(params: {
    startDate: string;
    endDate: string;
  }) {
    return withLoadingAndError(async () => {
      const { startDate, endDate } = params;
      const QueryParams = `?startDate=${startDate}&endDate=${endDate}`;
      const res = await api.get<SellerAnalytics>(
        `/seller/profile/analytics${QueryParams}`
      );
      return res;
    });
  }
  return {
    loading,
    error,
    fetchSellerStats,
    fetchSellerAnalytics,
  };
}
