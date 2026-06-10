"use client";

import React from "react";
import { CreateProductData } from "@/types/product";
import { useProduct } from "@/hooks/useProduct";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/shared/Button";
import ProductForm from "@/components/seller/ProductForm";

export default function SellerProductCreatePage() {
  const { createProduct, loading, error } = useProduct();

  const handleCreate = async (data: CreateProductData | any) => {
    await createProduct(data as CreateProductData);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-muted-foreground/20"
          >
            <Link href="/seller/product">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              New Product
            </h1>
            <p className="text-muted-foreground">
              Add a new product to your inventory
            </p>
          </div>
        </div>
      </div>

      <ProductForm onSubmit={handleCreate} isLoading={loading} />

      {error && (
        <div className="mt-4 rounded-md bg-destructive/15 p-3 text-destructive text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
