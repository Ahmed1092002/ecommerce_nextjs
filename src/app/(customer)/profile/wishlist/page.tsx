"use client";
import { useWishlist, WishlistItem } from "@/hooks/useWishlist";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CustomerProductCard } from "@/components/customer/CustomerProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function WishlistPage() {
  const router = useRouter();
  const { getWishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    setIsLoading(true);
    try {
      const response = await getWishlistItems(1);
      setItems(response?.data || []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      toast.error("Failed to load wishlist items");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveFromWishlist(productId: number) {
    try {
      await removeFromWishlist(productId);
      setItems(items.filter((item) => item.id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  }

  async function handleAddToCart(productId: number, productName: string) {
    try {
      await addToCart({ productId, quantity: 1 });
      toast.success(`${productName} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart");
    }
  }

  async function handleMoveAllToCart() {
    try {
      for (const item of items) {
        await addToCart({ productId: item.id as number, quantity: 1 });
      }
      toast.success("All items moved to cart!");
    } catch (error) {
      console.error("Failed to move items to cart:", error);
      toast.error("Failed to move some items to cart");
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <Heart className="h-24 w-24 text-gray-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 max-w-md">
              Save your favorite items here and keep track of products you love!
            </p>
          </div>
          <Button
            onClick={() => router.push("/product")}
            className="mt-4 px-8 py-3 text-lg"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {items.length > 0 && (
          <Button
            onClick={handleMoveAllToCart}
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Move All to Cart
          </Button>
        )}
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {/* Remove from Wishlist Button */}
            <Button
              onClick={() => handleRemoveFromWishlist(item.id as number)}
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <CustomerProductCard
              product={{
                id: item.id?.toString() || "",
                name: item.name,
                price: item.price,
                finalPrice: item.finalPrice,
                discount: item.discount,
                stock: item.quantity || 0,
                image: item.image,
                rating: 4.5,
              }}
              onAddToCart={() => handleAddToCart(item.id as number, item.name)}
              link="/product/"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
