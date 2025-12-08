import Link from "next/link";
import Image from "next/image"; // Import next/image for optimized images
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/helpers";
import { ShoppingCart, StarIcon, Heart } from "lucide-react"; // Assuming you have lucide-react for icons

interface ProductCardProps {
  buttonTitle?: string;
  onButtonClick?: () => void;
  onAddToCartClick?: () => void;
  onWishlistClick?: () => void;
  showAddToCartButton?: boolean;
  showWishlistButton?: boolean;
  isInWishlist?: boolean;
  link?: string;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image?: string;
    rating?: number; // Added rating for enhancement
  };
}

export function ProductCard({
  product,
  buttonTitle,
  onButtonClick,
  onAddToCartClick,
  onWishlistClick,
  showAddToCartButton = true,
  showWishlistButton = true,
  isInWishlist = false,
  link = "/products/",
}: ProductCardProps) {
  // Determine if product is out of stock for conditional styling/text
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md ">
      {/* Product Image and Quick View */}
      <CardHeader className="relative h-48 p-0">
        <Link href={`${link}${product.id}`} className="block h-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill // Make image fill the parent
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500">
              No Image
            </div>
          )}
        </Link>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            className="translate-y-4 text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            onClick={() => console.log("Quick View Clicked for", product.name)} // Replace with actual quick view logic
          >
            Quick View
          </Button>
        </div>

        {/* Wishlist Button */}
        {showWishlistButton && onWishlistClick && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute left-2 top-2 h-9 w-9 rounded-full shadow-md transition-all ${
              isInWishlist
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistClick();
            }}
          >
            <Heart
              className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
            />
          </Button>
        )}

        <div>
          {product.stock < 5 && product.stock > 0 && (
            <Badge
              variant="default"
              className="absolute right-2 top-2 px-2 py-0.5 text-xs"
            >
              Low Stock
            </Badge>
          )}
          {showAddToCartButton && (
            <Button
              variant="default"
              className="absolute right-2 top-2 px-2 py-0.5 text-xs cursor-pointer"
              onClick={onAddToCartClick}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          )}
          {isOutOfStock && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 bg-gray-700 text-white px-2 py-0.5 text-xs"
            >
              Out of Stock
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Product Details */}
      <CardContent className="flex flex-grow flex-col p-4 ">
        {/* Product Name */}
        <Link href={`${link}${product.id}`}>
          <h3 className="line-clamp-2 text-base font-semibold  hover:text-primary ">
            {product.name}
          </h3>
        </Link>

        {/* Price and Rating */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-bold ">{formatPrice(product.price)}</p>
          {product.rating !== undefined && ( // Only show rating if it exists
            <div className="flex items-center text-sm ">
              <StarIcon className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Add to Cart Button */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onButtonClick}
          className="w-full text-base font-semibold transition-all duration-200 cursor-pointer"
          disabled={isOutOfStock}
          variant={isOutOfStock ? "secondary" : "default"}
        >
          {isOutOfStock ? "Sold Out" : buttonTitle || "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
