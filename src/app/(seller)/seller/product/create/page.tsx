"use client";
import { CreateProductData } from "@/types/product";
import React from "react";
import z from "zod";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { useProduct } from "@/hooks/useProduct";
import Link from "next/link";
import { BackpackIcon, StepBackIcon } from "lucide-react";

// --- 1. Define Zod Validation Schema and Types ---
const validation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  // Note: HTML input type="number" gives strings, so we use z.coerce.number()
  // and handle potential NaN from empty string or non-numeric input.
  price: z.coerce.number().min(1, "Price must be at least 1"),
  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});

type ValidationType = z.infer<typeof validation>;
type ErrorsType = {
  [key in keyof ValidationType]?: string;
};

// --- 2. Initial State ---
const initialProductData: ValidationType = {
  name: "",
  description: "",
  price: 0, // Using 0 for initial number values
  discount: 0,
  quantity: 0,
};

export default function SellerProductCreatePage() {
  const [productData, setProductData] =
    React.useState<ValidationType>(initialProductData);
  const [errors, setErrors] = React.useState<ErrorsType>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createProduct, Loading, error } = useProduct();

  // --- 3. Handle Input Changes ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;

    // Convert to number for number inputs, otherwise keep as string
    let parsedValue: string | number = value;
    if (type === "number") {
      // Allow empty string to clear the input, Zod will handle coercion on submit
      parsedValue = value === "" ? "" : Number(value);
    }

    setProductData((prevData) => ({
      ...prevData,
      [id]: parsedValue,
    }));

    // Clear the error for the field being edited
    if (errors[id as keyof ValidationType]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: undefined,
      }));
    }
  };

  // --- 4. Validation and Submission Logic ---
  const handleValidation = (data: ValidationType) => {
    try {
      validation.parse(data);
      setErrors({}); // Clear all errors if validation passes
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: ErrorsType = {};
        for (const issue of err.issues) {
          // Use the path as the key, assuming the path is just the field name
          if (issue.path.length > 0) {
            newErrors[issue.path[0] as keyof ValidationType] = issue.message;
          }
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = handleValidation(productData);

    if (isValid) {
      // The productData is already ValidationType/CreateProductData shape
      await createProduct(productData as CreateProductData);

      // Reset form if submission was successful (optional)
      // if (!error && !Loading) {
      //   setProductData(initialProductData);
      // }
    }

    setIsSubmitting(false);
  };

  // --- 5. Total Price Calculation ---
  function showTotalPrice() {
    // Access productData directly
    const nPrice = Number(productData.price) || 0;
    const nDiscount = Number(productData.discount) || 0;

    if (!nPrice) return 0; // no price entered
    if (!nDiscount) return nPrice; // no discount applied

    const boundedDiscount = Math.min(Math.max(nDiscount, 0), 100);
    const discountAmount = (nPrice * boundedDiscount) / 100;
    const total = nPrice - discountAmount;

    return Math.max(0, total);
  }

  // console.log("Product Data:", productData);
  // console.log("Errors:", errors);

  // --- 6. Render Form ---
  return (
    <div>
      <header className="mb-6 bg-(--primary)/10 p-4 rounded-md space-y-1 flex gap-2">
        <Button variant="link" className="p-0 bg-(--primary) p-3">
          <Link href="/seller/product">
            <StepBackIcon className="text-white" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Product</h1>
      </header>
      <form onSubmit={onSubmit} className="grid gap-4 max-w-lg mx-auto">
        <Input
          label="Product Name"
          placeholder="Enter product name"
          id="name"
          value={productData.name}
          onChange={handleChange}
          error={errors.name}
          // type="text" is default
        />
        <Input
          label="Description"
          placeholder="Enter product description"
          id="description"
          value={productData.description}
          onChange={handleChange}
          error={errors.description}
          // Assuming Input component can handle multiline or this is a standard text input
        />
        <Input
          label="Price"
          type="number"
          placeholder="Enter product price"
          id="price"
          // We cast to string for the input field to be controlled correctly
          value={
            productData.price === 0 && productData.price !== ""
              ? ""
              : String(productData.price)
          }
          onChange={handleChange}
          error={errors.price}
        />

        <Input
          label="Discount"
          type="number"
          placeholder="Enter product discount (%)"
          id="discount"
          // We cast to string for the input field to be controlled correctly
          value={
            productData.discount === 0 && productData.discount !== ""
              ? ""
              : String(productData.discount)
          }
          onChange={handleChange}
          error={errors.discount}
        />
        <Input
          label="Quantity"
          type="number"
          placeholder="Enter product quantity"
          id="quantity"
          // We cast to string for the input field to be controlled correctly
          value={
            productData.quantity === 0 && productData.quantity !== ""
              ? ""
              : String(productData.quantity)
          }
          onChange={handleChange}
          error={errors.quantity}
        />

        {/* Display backend error if present */}
        {error && (
          <div className="text-red-500 text-sm text-center">Error: {error}</div>
        )}

        <div className="text-right font-medium">
          Total Price after Discount: ${" "}
          {isNaN(showTotalPrice()) ? 0 : showTotalPrice().toFixed(2)}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || Loading}
          variant="default"
          className="w-full bg-primary"
        >
          {isSubmitting || Loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
