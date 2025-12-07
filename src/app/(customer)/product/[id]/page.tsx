"use client";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import {
  Heart,
  ShoppingCart,
  Truck,
  Package,
  Shield,
  ChevronRight,
  Home,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { formatPrice } from "@/utils/helpers";
import { useCart } from "@/hooks/useCart";

type ProductDetail = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  finalPrice: number;
  image?: string;
  colors?: string[];
  storage?: string[];
  specifications?: {
    screenSize?: string;
    cpu?: string;
    cores?: number;
    mainCamera?: string;
    frontCamera?: string;
    batteryCapacity?: string;
  };
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getProductById, Loading: loadingProduct } = useProduct();
  const { addToCart, Loading: loadingCart } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const response = await getProductById(id as string);
        if (response) {
          setProduct(response as unknown as ProductDetail);
        }
      }
    }
    load();
  }, []);

  async function addProductToCart() {
    if (!product) return;
    toast.loading(`Adding ${quantity} ${product.name} to cart...`);
    await addToCart({
      productId: product.id,
      quantity,
    });
    toast.dismiss();
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  }

  function toggleWishlist() {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Mock data for demonstration (replace with actual product data)
  const mockImages = [
    "/placeholder-product-1.jpg",
    "/placeholder-product-2.jpg",
    "/placeholder-product-3.jpg",
    "/placeholder-product-4.jpg",
  ];

  const mockColors = ["#000000", "#9333EA", "#DC2626", "#EAB308", "#E5E7EB"];
  const mockStorage = ["128GB", "256GB", "512GB", "1TB"];

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="w-full h-[500px] rounded-xl" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-full h-24 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/product")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount > 0;
  const isInStock = product.quantity > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => router.push("/product")}
              className="hover:text-foreground transition-colors"
            >
              Products
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden border border-[var(--border)]">
              {product.image && product.image.length > 0 ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (4.9 • 128 reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                {formatPrice(product.finalPrice)}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description ||
                  "Enhanced capabilities thanks to an enlarged display of 6.7 inches and work without recharging throughout the day. Incredible photos in weak, yes and in bright lighting using the new system with two cameras."}
              </p>
              <button className="text-sm font-medium text-primary hover:underline">
                more...
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold">Quantity:</label>
              <div className="flex items-center border border-[var(--border)] rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="rounded-r-none"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-6 py-2 font-semibold min-w-[60px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.quantity}
                  className="rounded-l-none"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.quantity} available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleWishlist}
                className="gap-2"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-destructive text-destructive" : ""
                  }`}
                />
                Add to Wishlist
              </Button>
              <Button
                size="lg"
                onClick={addProductToCart}
                disabled={!isInStock}
                className="gap-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border)]">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Truck className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Free Delivery</p>
                  <p className="text-sm font-semibold">1-2 day</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                  <p className="text-sm font-semibold">Today</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Shield className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guaranteed</p>
                  <p className="text-sm font-semibold">1 year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
