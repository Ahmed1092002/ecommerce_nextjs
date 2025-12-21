"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import Link from "next/link";
import {
  UploadCloud,
  ImageIcon,
  DollarSign,
  Package,
  Save,
} from "lucide-react";
import useUploadImage from "@/hooks/useUploadImage";
import Image from "next/image";
import { CreateProductData, UpdateProductData } from "@/types/product";

// Zod Validation Schema
const validation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});

export type ValidationType = z.infer<typeof validation>;
type ErrorsType = {
  [key in keyof ValidationType]?: string;
} & { image?: string };

interface ProductFormProps {
  initialData?: UpdateProductData | null;
  onSubmit: (data: CreateProductData | UpdateProductData) => Promise<void>;
  isLoading: boolean;
  isEditMode?: boolean;
}

const initialProductDataState: ValidationType = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  quantity: 0,
};

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  isEditMode = false,
}: ProductFormProps) {
  // Initialize state directly from initialData prop to avoid useEffect
  const [productData, setProductData] = useState<ValidationType>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        discount: initialData.discount || 0,
        quantity: initialData.quantity || 0,
      };
    }
    return initialProductDataState;
  });
  const [errors, setErrors] = useState<ErrorsType>({});
  const { getImageFile, imageFile, displayUrl, uploadImage } = useUploadImage();

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }

    setProductData((prev) => ({
      ...prev,
      [id]: parsedValue,
    }));

    if (errors[id as keyof ValidationType]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleValidation = (data: ValidationType) => {
    try {
      validation.parse(data);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: ErrorsType = {};
        for (const issue of err.issues) {
          if (issue.path.length > 0) {
            newErrors[issue.path[0] as keyof ValidationType] = issue.message;
          }
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = handleValidation(productData);

    if (isValid) {
      let finalImageUrl = initialData?.image; // Default to existing image in edit mode

      // Check if a new file is selected
      const fileInput = e.currentTarget.elements.namedItem(
        "image"
      ) as HTMLInputElement;

      if (fileInput?.files?.length) {
        const newUrl = await uploadImage(fileInput.files[0]);
        if (newUrl) {
          finalImageUrl = newUrl;
        }
      } else if (!isEditMode && !finalImageUrl) {
        // If create mode and no image uploaded
        // Note: Logic here handles the required check if you want to enforce image
        // strict validation logic could be added here if needed.
        // For now, consistent with previous behavior, we pass what we have.
      }

      await onSubmit({
        ...productData,
        image: finalImageUrl,
        // Preserve ID if editing, though it might not be strictly necessary depending on API
        ...(isEditMode && initialData ? { id: initialData.id } : {}),
      } as CreateProductData | UpdateProductData);
    }
  };

  function showTotalPrice() {
    const nPrice = Number(productData.price) || 0;
    const nDiscount = Number(productData.discount) || 0;
    if (!nPrice) return 0;
    const boundedDiscount = Math.min(Math.max(nDiscount, 0), 100);
    const discountAmount = (nPrice * boundedDiscount) / 100;
    return Math.max(0, nPrice - discountAmount);
  }

  // Determine which image to show: New Preview > Existing Data > Placeholder
  const currentDisplayImage =
    displayUrl || (initialData?.image ? initialData.image : null);

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      {/* Left Column: Image Upload */}
      <div className="lg:col-span-1">
        <div className="card space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Product Image
          </h3>
          <div className="relative group overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={getImageFile}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-muted/30 p-4 transition-colors group-hover:bg-muted/50">
              {currentDisplayImage ? (
                <div className="relative h-full w-full overflow-hidden rounded-md">
                  <Image
                    src={currentDisplayImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-white font-medium flex items-center gap-2">
                      <UploadCloud className="w-5 h-5" /> Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-full bg-background p-4 shadow-sm">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground text-center">
                    Click or drag to {isEditMode ? "update" : "upload"}
                  </p>
                  <p className="text-xs text-muted-foreground/75 text-center">
                    Supports JPG, PNG, WEBP
                  </p>
                </>
              )}
            </div>
          </div>
          {errors.image && (
            <p className="text-sm font-medium text-destructive">
              {errors.image}
            </p>
          )}
        </div>
      </div>

      {/* Right Column: details */}
      <div className="lg:col-span-2 space-y-6">
        {/* General Info */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            General Information
          </h3>
          <div className="grid gap-4">
            <Input
              label="Product Name"
              placeholder="Ex: Wireless Noise-Cancelling Headphones"
              id="name"
              value={productData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Detailed description of your product..."
                className={`flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                value={productData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-sm font-medium text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Pricing & Inventory
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Base Price ($)"
              type="number"
              placeholder="0.00"
              id="price"
              value={
                productData.price === 0 && productData.price 
                  ? ""
                  : String(productData.price)
              }
              onChange={handleChange}
              error={errors.price}
            />
            <Input
              label="Discount (%)"
              type="number"
              placeholder="0"
              id="discount"
              value={
                productData.discount === 0 && productData.discount 
                  ? ""
                  : String(productData.discount)
              }
              onChange={handleChange}
              error={errors.discount}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-end">
            <Input
              label="Quantity In Stock"
              type="number"
              placeholder="Available stock"
              id="quantity"
              value={
                productData.quantity === 0 && productData.quantity 
                  ? ""
                  : String(productData.quantity)
              }
              onChange={handleChange}
              error={errors.quantity}
            />

            <div className="rounded-lg bg-secondary/50 p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Final Price</p>
              <p className="text-2xl font-bold text-primary">
                $
                {isNaN(showTotalPrice()) ? "0.00" : showTotalPrice().toFixed(2)}
              </p>
              {Number(productData.discount) > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  ${Number(productData.price).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            <Link href="/seller/product">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[150px] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />{" "}
                {isEditMode ? "Save Changes" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
