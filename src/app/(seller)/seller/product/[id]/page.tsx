"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { Button } from "@/components/shared/Button";
import { CreateProductData, UpdateProductData } from "@/types/product";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import ProductForm from "@/components/seller/ProductForm";
import Modal from "@/components/shared/modal";

export default function ProductSellerDetails() {
  const { id } = useParams();
  const { getProductById, loading, error, updateProduct, deleteProduct } =
    useProduct();

  const [productData, setProductData] = useState<UpdateProductData | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id as string);
        if (!mounted) return;

        const pData = res;

        if (pData) {
          setProductData(pData as UpdateProductData);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdate = async (data: UpdateProductData | CreateProductData) => {
    // If data does not have id, assign it from params (for UpdateProductData)
    if (!("id" in data) && id) {
      (data as UpdateProductData).id = Array.isArray(id) ? Number(id[0]) : Number(id);
    }
    await updateProduct(data as UpdateProductData);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProduct(Number(id));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  if (loading && !productData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!productData && !loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Product not found or failed to load.
      </div>
    );
  }

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
              Edit Product
            </h1>
            <p className="text-muted-foreground">Manage your product details</p>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete Product
        </Button>
      </div>

      <ProductForm
        initialData={productData}
        onSubmit={handleUpdate}
        isLoading={loading}
        isEditMode={true}
      />

      {error && (
        <div className="mt-4 rounded-md bg-destructive/15 p-3 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        maxWidth="sm"
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        }
      >
        <p className="text-muted-foreground">
          Are you sure you want to delete <strong>{productData?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
