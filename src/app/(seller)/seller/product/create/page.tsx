"use client";
import { CreateProductData } from "@/types/product";
import React from "react";
import z from "zod";
import { Input } from "@/components/shared/Input";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Button } from "@/components/shared/Button";
import { useProduct } from "@/hooks/useProduct";

export default function SellerProductCreatePage() {
  const [productData, setProductData] = React.useState<CreateProductData>({
    name: "",
    description: "",
    price: 0,
    rating: 0,
    discount: 0,
    quantity: 0,
  });
  const { createProduct, Loading, error } = useProduct();

  const validation = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    price: z.number().min(1, "Price must be at least 1"),
    rating: z.number().min(0).max(5),
    discount: z.number().min(0).max(100),
    quantity: z.number().min(0, "Quantity cannot be negative"),
  });
  type ValidationType = z.infer<typeof validation>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    control,
  } = useForm<ValidationType>({
    resolver: zodResolver(validation),
  });
  async function onSubmit(data: ValidationType) {
    await createProduct(data as CreateProductData);
  }
  // Live watch price & discount from form for total calculation
  const price = useWatch({ control, name: "price" }) ?? productData.price ?? 0;
  const discount =
    useWatch({ control, name: "discount" }) ?? productData.discount ?? 0;
  function showTotalPrice() {
    const nPrice = Number(price) || 0;
    const nDiscount = Number(discount) || 0;
    if (!nPrice) return 0; // no price entered
    if (!nDiscount) return nPrice; // no discount applied
    const boundedDiscount = Math.min(Math.max(nDiscount, 0), 100);
    const discountAmount = (nPrice * boundedDiscount) / 100;
    const total = nPrice - discountAmount;
    return Math.max(0, total);
  }
  React.useEffect(() => {
    setProductData(getValues());
  }, [getValues]);
  console.log("Product Data:", productData);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 max-w-lg mx-auto"
      >
        <Input
          label="Product Name"
          placeholder="Enter product name"
          id="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Description"
          placeholder="Enter product description"
          id="description"
          error={errors.description?.message}
          {...register("description")}
        />
        <Input
          label="Price"
          type="number"
          placeholder="Enter product price"
          id="price"
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        <Input
          label="Rating"
          type="number"
          placeholder="Enter product rating"
          id="rating"
          error={errors.rating?.message}
          {...register("rating", { valueAsNumber: true })}
        />
        <Input
          label="Discount"
          type="number"
          placeholder="Enter product discount (%)"
          id="discount"
          error={errors.discount?.message}
          {...register("discount", { valueAsNumber: true })}
        />
        <Input
          label="Quantity"
          type="number"
          placeholder="Enter product quantity"
          id="quantity"
          error={errors.quantity?.message}
          {...register("quantity", { valueAsNumber: true })}
        />
        <div className="text-right font-medium">
          Total Price after Discount: $
          {isNaN(showTotalPrice()) ? 0 : showTotalPrice().toFixed(2)}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
