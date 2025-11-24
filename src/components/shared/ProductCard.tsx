import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="h-48 bg-slate-100 rounded-t-lg flex items-center justify-center text-slate-400">
            {product.images?.[0] ? "Image" : "No Image"}
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold truncate hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-slate-900 mt-2">
          {formatPrice(product.price)}
        </p>
        {product.stock < 5 && product.stock > 0 && (
          <Badge variant="outline" className="mt-2">
            Only {product.stock} left
          </Badge>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={product.stock === 0}
          variant={product.stock === 0 ? "outline" : "default"}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}