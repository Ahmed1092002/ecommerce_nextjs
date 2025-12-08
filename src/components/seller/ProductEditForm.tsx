import { UpdateProductData } from "@/types/product";
import { calculateFinalPrice } from "@/utils/helpers";
import z from "zod";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
type ValidationErrors = Partial<Record<keyof UpdateProductData, string>>;

interface ProductEditFormProps {
  product: UpdateProductData;
  errors: ValidationErrors;
  onCancel: () => void;
  setProduct: React.Dispatch<React.SetStateAction<UpdateProductData | null>>;
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
  updateProduct: (data: UpdateProductData) => Promise<void>;
  setMode: React.Dispatch<React.SetStateAction<"view" | "edit">>;
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
  setProduct,
  setErrors,
  updateProduct,
  onCancel,
  setMode,
}: ProductEditFormProps) {
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
  const finalPrice = calculateFinalPrice(
    product.price || 0,
    product.discount || 0
  );

  return (
    <form onSubmit={handleEditSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Editing {product.name}</h2>

      <Input
        label="Product Name"
        id="name"
        value={product.name}
        onChange={handleInputChange}
        error={errors.name}
      />

      <Input
        label="Description"
        id="description"
        value={product.description}
        onChange={handleInputChange}
        error={errors.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Price"
          type="number"
          id="price"
          value={product.price}
          onChange={handleInputChange}
          error={errors.price}
        />
        <Input
          label="Discount (%)"
          type="number"
          id="discount"
          value={product.discount}
          onChange={handleInputChange}
          error={errors.discount}
        />
        <Input
          label="Quantity"
          type="number"
          id="quantity"
          value={product.quantity}
          onChange={handleInputChange}
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
