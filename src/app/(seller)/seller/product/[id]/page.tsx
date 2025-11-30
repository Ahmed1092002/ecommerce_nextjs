"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { UpdateProductData } from "@/types/product";
import { ProductView } from "@/components/seller/ProductView";
import {
  ProductEditForm,
  validateProduct,
} from "@/components/seller/ProductEditForm";

type DetailMode = "view" | "edit";
type ValidationErrors = Partial<Record<keyof UpdateProductData, string>>;

export default function ProductSellerDetails() {
  const { id } = useParams();
  const { getProductById, Loading, error, updateProduct } = useProduct();

  const [product, setProduct] = useState<UpdateProductData | null>(null);
  const [mode, setMode] = useState<DetailMode>("view");
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        if (!mounted) return;

        const pData =
          Array.isArray(res?.data) && res.data.length > 0 ? res.data[0] : res;

        setProduct(pData as UpdateProductData);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id, getProductById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setProduct((prev) => {
      if (!prev) return null;
      const newValue = type === "number" ? Number(value) : value;
      return { ...prev, [id]: newValue };
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    const validationResult = validateProduct(product);

    if (!validationResult.success) {
      setErrors(validationResult.errors);
      return;
    }

    try {
      await updateProduct(product as UpdateProductData);
      setMode("view");
      setErrors({});
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "view" ? "edit" : "view"));
    if (mode === "edit") setErrors({});
  };

  if (Loading) {
    return <div className="p-6 text-center">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center">
        Error fetching product: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No product found for ID: {id}.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6 border-b border-(--border) pb-3">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Button
          variant={mode === "view" ? "default" : "destructive"}
          onClick={toggleMode}
        >
          {mode === "view" ? "Edit Product" : "Cancel Edit"}
        </Button>
      </div>

      {mode === "view" ? (
        <ProductView product={product} />
      ) : (
        <ProductEditForm
          product={product}
          errors={errors}
          onInputChange={handleInputChange}
          onSubmit={handleEditSubmit}
          onCancel={toggleMode}
        />
      )}
    </div>
  );
}
