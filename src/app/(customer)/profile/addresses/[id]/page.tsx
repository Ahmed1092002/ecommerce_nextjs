"use client";

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
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditCustomerAddressPage() {
  const { getCustomerAddressById, updateCustomerAddress, loading } =
    useAddress();
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [address, setAddress] = useState<AddressData | undefined>(undefined);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!id) return;
      try {
        const response = await getCustomerAddressById(id);
        // Assuming response is the address object based on useAddress hook implementation for individual fetches
        setAddress(response as unknown as AddressData);
      } catch (error) {
        console.error("Failed to fetch address:", error);
        router.push("/profile/addresses");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (data: CreateAddressData | UpdateAddressData) => {
    try {
      await updateCustomerAddress(id, data as UpdateAddressData);
      router.push("/profile/addresses");
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary)"></div>
      </div>
    );
  }

  if (!address) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/profile/addresses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-(--primary)" />
              Edit Address
            </h1>
            <p className="text-gray-600">
              Update your shipping or billing address
            </p>
          </div>
        </div>

        <Card className="p-6">
          <AddressForm
            initialData={address}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/profile/addresses")}
            isLoading={loading}
            isSeller={false}
          />
        </Card>
      </div>
    </div>
  );
}
