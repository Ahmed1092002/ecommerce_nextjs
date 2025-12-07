"use client";

import { useEffect, useState } from "react";
import useAddress from "@/hooks/useAddress";
import { AddressData } from "@/types/address";
import { AddressCard } from "@/components/shared/AddressCard";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CustomerAddressesPage() {
  const {
    loading,
    getCustomerAddresses,
    deleteCustomerAddress,
    setCustomerAddressDefault,
  } = useAddress();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // Get page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchAddresses = async (page: number) => {
    try {
      // API expects 0-indexed page, UI is 1-indexed
      const response = await getCustomerAddresses(page);
      if (response && response.data) {
        setAddresses(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteCustomerAddress(Number(id));
        fetchAddresses(currentPage);
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setCustomerAddressDefault(Number(id));
      fetchAddresses(currentPage);
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/profile/addresses?page=${page}`);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-(--primary)" />
              My Addresses
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your shipping and billing addresses
            </p>
          </div>
          <Button
            onClick={() => router.push("/profile/addresses/create")}
            className="bg-(--primary) hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {loading && addresses.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary)"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No addresses found
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Add an address to speed up your checkout process
            </p>
            <Button
              onClick={() => router.push("/profile/addresses/create")}
              variant="outline"
              className="border-(--primary) text-(--primary) hover:bg-(--primary)/5"
            >
              Add Your First Address
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => router.push(`/profile/addresses/${address.id}`)}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
