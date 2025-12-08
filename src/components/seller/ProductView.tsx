import { UpdateProductData } from "@/types/product";
import { Update } from "next/dist/build/swc/types";

export interface ProductViewProps {
  product: UpdateProductData;
}

export function ProductView({ product }: ProductViewProps) {
  return (
    <div className="space-y-6">
      <p className="leading-relaxed whitespace-pre-wrap">
        {product.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t border-(--border)">
        <div>
          <h2 className="text-xl font-semibold mb-3">Pricing Details</h2>
          <DetailItem
            label="Base Price"
            value={`$${product.price?.toFixed(2) ?? "-"}`}
          />
          <DetailItem label="Discount" value={`${product.discount ?? 0}%`} />
          <DetailItem
            label="Final Price"
            value={
              <span className="text-xl font-bold text-primary">
                ${product.finalPrice?.toFixed(2) ?? "-"}
              </span>
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Inventory & ID</h2>
          <DetailItem
            label="Quantity in Stock"
            value={product.quantity ?? "-"}
          />
        </div>
      </div>
    </div>
  );
}
function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="font-medium">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
