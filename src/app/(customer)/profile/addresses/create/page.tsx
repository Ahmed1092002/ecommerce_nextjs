"use client";

import { useAuth } from "@/hooks/useAuth";
import useAddress from "@/hooks/useAddress";
import { AddressForm } from "@/components/shared/AddressForm";
import { CreateAddressData, UpdateAddressData } from "@/types/address";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";

export default function CreateSellerAddressPage() {
  const { createSellerAddress, loading } = useAddress();
  const router = useRouter();

  const handleCreate = async (data: CreateAddressData | UpdateAddressData) => {
    try {
      await createSellerAddress(data as CreateAddressData);
      router.push("/seller/addresses");
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

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
              Add New Address
            </h1>
            <p className="text-gray-600">
              Add a new business location or shipping origin
            </p>
          </div>
        </div>

        <Card className="p-6">
          <AddressForm
            onSubmit={handleCreate}
            onCancel={() => router.push("/seller/addresses")}
            isLoading={loading}
            isSeller={true}
          />
        </Card>
      </div>
    </div>
  );
}
