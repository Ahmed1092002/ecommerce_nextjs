import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/helpers";
import { ShoppingCart, Star, Heart, Eye, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CustomerProductCardProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    rating?: number;
    discount?: number;
    finalPrice?: number;
  };
  onAddToCart?: () => void;

  link?: string;
}

export function CustomerProductCard({
  product,
  onAddToCart,

  link = "/product/",
}: CustomerProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const hasDiscount = product.discount && product.discount > 0;
  const displayPrice = product.finalPrice || product.price;
  const { user } = useAuth();
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Section */}
      <CardHeader className="relative h-64 p-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link href={`${link}${product.id}`} className="block h-full w-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-500">
                  No Image Available
                </p>
              </div>
            </div>
          )}
        </Link>

        {/* Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <Link href={`${link}${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Top-left Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md px-3 py-1 text-xs font-bold">
              <TrendingUp className="h-3 w-3 mr-1" />
              {product.discount}% OFF
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge
              variant="destructive"
              className="shadow-md px-3 py-1 text-xs font-semibold"
            >
              Only {product.stock} left
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-gray-800 text-white shadow-md px-3 py-1 text-xs font-semibold">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Product Details Section */}
      <CardContent className="flex flex-grow flex-col p-5 space-y-3">
        {/* Product Name */}
        <Link href={`${link}${product.id}`}>
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 hover:text-(--primary) transition-colors ">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex-column items-baseline gap-2 pt-2 ">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(displayPrice)}
          </p>
          {hasDiscount && (
            <p className="text-sm font-medium text-gray-400 line-through">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`h-2 w-2 rounded-full ${
              isOutOfStock
                ? "bg-red-500"
                : isLowStock
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          />
          <span
            className={`font-medium ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
              ? "Low Stock"
              : "In Stock"}
          </span>
        </div>
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold text-base py-6 rounded-xl transition-all duration-300 text-white ${
            isOutOfStock ? "bg-gray-300 cursor-not-allowed" : " hover:shadow-lg"
          }`}
        >
          {isOutOfStock ? (
            "Sold Out"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
