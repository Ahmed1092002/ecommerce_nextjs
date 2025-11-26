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
    <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="h-48 bg-gradient-to-br from-blue-50 to-orange-50 rounded-t-lg flex items-center justify-center text-slate-400 font-medium hover:from-blue-100 hover:to-orange-100 transition-all">
            {product.images?.[0] ? "📦 Image" : "📦 No Image"}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold truncate hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mt-2">
          {formatPrice(product.price)}
        </p>
        {product.stock < 5 && product.stock > 0 && (
          <Badge
            variant="outline"
            className="mt-2 border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            ⚡ Only {product.stock} left
          </Badge>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all"
          disabled={product.stock === 0}
          variant={product.stock === 0 ? "outline" : "default"}
        >
          {product.stock === 0 ? "❌ Out of Stock" : "🛒 Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
