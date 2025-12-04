import { useState } from "react";
import { api, ApiErrorWithField } from "@/lib/api-client";
import { toast } from "react-toastify";
import { Address, CreateAddressData, UpdateAddressData } from "@/types/address";

export default function useAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Helper function to extract and handle errors
  function handleError(error: unknown): string {
    let errorMessage = "An error occurred";
    if (error instanceof ApiErrorWithField) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    setError(errorMessage);
    toast.error(errorMessage);
    return errorMessage;
  }
  async function withLoadingAndError<T>(
    operation: () => Promise<T>,
    successMessage?: string
  ): Promise<T> {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getSellerAddresses(page: number) {
    return withLoadingAndError(async () => {
      const res = await api.get<Address>(`/seller/addresses?page=${page}`);
      return res;
    }, "Profile loaded successfully!");
  }

  async function getCustomerAddresses(page: number) {
    return withLoadingAndError(async () => {
      const res = await api.get<Address>(`/customer/addresses?page=${page}`);
      return res;
    }, "Profile loaded successfully!");
  }

  async function createSellerAddress(addressData: CreateAddressData) {
    return withLoadingAndError(async () => {
      const res = await api.post<Address>(`/seller/addresses`, addressData);
      return res;
    }, "Address created successfully!");
  }

  async function updateSellerAddress(
    id: number,
    addressData: UpdateAddressData
  ) {
    return withLoadingAndError(async () => {
      const res = await api.put<Address>(
        `/seller/addresses/${id}`,
        addressData
      );
      return res;
    }, "Address updated successfully!");
  }

  async function createCustomerAddress(addressData: CreateAddressData) {
    return withLoadingAndError(async () => {
      const res = await api.post<Address>(`/customer/addresses`, addressData);
      return res;
    }, "Address created successfully!");
  }

  async function updateCustomerAddress(
    id: number,
    addressData: UpdateAddressData
  ) {
    return withLoadingAndError(async () => {
      const res = await api.put<Address>(
        `/customer/addresses/${id}`,
        addressData
      );
      return res;
    }, "Address updated successfully!");
  }

  async function deleteSellerAddress(id: number) {
    return withLoadingAndError(async () => {
      const res = await api.delete<Address>(`/seller/addresses/${id}`);
      return res;
    }, "Address deleted successfully!");
  }

  async function deleteCustomerAddress(id: number) {
    return withLoadingAndError(async () => {
      const res = await api.delete<Address>(`/customer/addresses/${id}`);
      return res;
    }, "Address deleted successfully!");
  }
  async function setSellerAddressDefault(id: number) {
    return withLoadingAndError(async () => {
      const res = await api.patch<Address>(`/seller/addresses/${id}/default`);
      return res;
    }, "Address set as default successfully!");
  }
  async function setCustomerAddressDefault(id: number) {
    return withLoadingAndError(async () => {
      const res = await api.patch(`/customer/addresses/${id}/default`);
      return res;
    }, "Address set as default successfully!");
  }
  async function getCustomerAddressDefault() {
    return withLoadingAndError(async () => {
      const res = await api.get(`/customer/addresses/default`);
      return res;
    }, "Address set as default successfully!");
  }

  async function getCustomerAddressById(id: number) {
    return withLoadingAndError(async () => {
      const res = await api.get<Address>(`/customer/addresses/${id}`);
      return res;
    }, "Address loaded successfully!");
  }

  async function getSellerAddressById(id: number) {
    return withLoadingAndError(async () => {
      const res = await api.get<Address>(`/seller/addresses/${id}`);
      return res;
    }, "Address loaded successfully!");
  }
  return {
    loading,
    error,
    getSellerAddresses,
    getCustomerAddresses,
    createSellerAddress,
    updateSellerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteSellerAddress,
    deleteCustomerAddress,
    setSellerAddressDefault,
    setCustomerAddressDefault,
    getCustomerAddressDefault,
    getCustomerAddressById,
    getSellerAddressById,
  };
}
