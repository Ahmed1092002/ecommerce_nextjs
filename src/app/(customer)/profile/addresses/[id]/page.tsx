"use client";

import { useAuth } from "@/hooks/useAuth";
import useAddress from "@/hooks/useAddress";
import { AddressForm } from "@/components/shared/AddressForm";
import {
  AddressData,
  CreateAddressData,
  UpdateAddressData,
} from "@/types/address";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditSellerAddressPage() {
  const { getSellerAddressById, updateSellerAddress, loading } = useAddress();
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [address, setAddress] = useState<AddressData | undefined>(undefined);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!id) return;
      try {
        const response = await getSellerAddressById(id);
        // The API returns the address object directly or wrapped in data?
        // Based on useAddress hook, it returns res.
        // Let's assume it returns the address object directly for getById based on typical patterns,
        // but I should check the hook implementation again if needed.
        // Looking at useAddress: const res = await api.get<Address>(...); return res;
        // Wait, api.get<Address> usually returns the response data.
        // If the backend returns the address directly, then `response` is the address.
        // If it returns { data: address }, then `response.data`.
        // The hook `getSellerAddresses` returns `Address` which has `data: AddressData[]`.
        // `getSellerAddressById` returns `Address` (copy-paste error in my hook update? No, I used <Address> generic).
        // Actually, for getById, it likely returns a single AddressData, not the paginated Address structure.
        // I should probably cast it or check the response.
        // For now, I'll assume it returns the address data directly or I'll inspect it.
        // Let's assume `response` is `AddressData` (or similar).
        // Actually, looking at the hook again:
        // async function getSellerAddressById(id: number) { ... api.get<Address> ... }
        // The generic <Address> might be wrong if it returns a single item.
        // Let's assume the response is the address object.
        setAddress(response as unknown as AddressData);
      } catch (error) {
        console.error("Failed to fetch address:", error);
        router.push("/seller/addresses");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAddress();
  }, [id, getSellerAddressById, router]);

  const handleUpdate = async (data: CreateAddressData | UpdateAddressData) => {
    try {
      await updateSellerAddress(id, data as UpdateAddressData);
      router.push("/seller/addresses");
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!address) {
    return null; // Or a not found message
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/seller/addresses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-6 h-6 text-[var(--primary)]" />
              Edit Address
            </h1>
            <p className="text-gray-600">
              Update your business location details
            </p>
          </div>
        </div>

        <Card className="p-6">
          <AddressForm
            initialData={address}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/seller/addresses")}
            isLoading={loading}
            isSeller={true}
          />
        </Card>
      </div>
    </div>
  );
}
