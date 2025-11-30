import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/helpers";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images?: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0 relative">
        <Link
          href={`/products/${product.id}`}
          className="block overflow-hidden"
        >
          <div className="aspect-square bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-500 relative">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">No Image</span>
            )}

            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              >
                Quick View
              </Button>
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium truncate hover:underline underline-offset-4">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-bold">{formatPrice(product.price)}</p>
          {product.stock < 5 && product.stock > 0 && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
              Low Stock
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={product.stock === 0}
          variant={product.stock === 0 ? "secondary" : "default"}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
