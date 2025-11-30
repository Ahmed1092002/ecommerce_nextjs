import { UpdateProductData } from "@/types/product";
import { calculateFinalPrice } from "@/utils/helpers";
import z from "zod";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
type ValidationErrors = Partial<Record<keyof UpdateProductData, string>>;

interface ProductEditFormProps {
  product: UpdateProductData;
  errors: ValidationErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}
export const productValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z.number().min(1, "Price must be at least 1"),
  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  finalPrice: z.number().optional(),
});

export function validateProduct(product: unknown) {
  const parsed = productValidationSchema.safeParse(product);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path && issue.path.length > 0) {
        const key = issue.path[0] as string;
        errors[key] = issue.message;
      }
    }
    return { success: false, errors };
  }

  return { success: true, errors: {} };
}
export function ProductEditForm({
  product,
  errors,
  onInputChange,
  onSubmit,
  onCancel,
}: ProductEditFormProps) {
  const finalPrice = calculateFinalPrice(
    product.price || 0,
    product.discount || 0
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Editing {product.name}</h2>

      <Input
        label="Product Name"
        id="name"
        value={product.name}
        onChange={onInputChange}
        error={errors.name}
      />

      <Input
        label="Description"
        id="description"
        value={product.description}
        onChange={onInputChange}
        error={errors.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Price"
          type="number"
          id="price"
          value={product.price}
          onChange={onInputChange}
          error={errors.price}
        />
        <Input
          label="Discount (%)"
          type="number"
          id="discount"
          value={product.discount}
          onChange={onInputChange}
          error={errors.discount}
        />
        <Input
          label="Quantity"
          type="number"
          id="quantity"
          value={product.quantity}
          onChange={onInputChange}
          error={errors.quantity}
        />
      </div>

      <Input
        label="Final Price"
        type="number"
        id="finalPrice"
        value={finalPrice}
        readOnly
      />
      <div className="flex gap-4">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
