"use client";
import { Loading } from "@/components/shared/Loading";
import { useCart } from "@/hooks/useCart";
import { Cart } from "@/types/cart";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/helpers";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  Home,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/modal";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { getCart, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  async function fetchCart() {
    setIsLoading(true);
    setError(null);
    try {
      const cartData = await getCart();
      setCart(cartData || null);
    } catch (error) {
      setError("An error occurred while fetching the cart.");
      toast.error("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeItemFromCart(cartItemId: number) {
    setUpdatingItems((prev) => new Set(prev).add(cartItemId));
    try {
      await removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart after removal
    } catch (error) {
      toast.error("Failed to remove item from cart");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  }

  async function updateItemQuantity(cartItemId: number, newQuantity: number) {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setUpdatingItems((prev) => new Set(prev).add(cartItemId));
    try {
      await updateCartQuantity(cartItemId, newQuantity);
      await fetchCart(); // Refresh cart after update
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  }

  async function handleClearCart() {
    setIsLoading(true);
    try {
      await clearCart();
      await fetchCart(); // Refresh cart after clearing
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  function openModal() {
    setIsModalOpen(true);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Empty cart state
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-card border-b border-[var(--border)] mb-8">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Shopping Cart</span>
            </nav>

            {/* Page Title */}
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8" />
              <h1 className="text-4xl font-bold tracking-tight">
                Shopping Cart
              </h1>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button
              size="lg"
              className="gap-2 text-base font-semibold"
              onClick={() => router.push("/product")}
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-card border-b border-[var(--border)] mb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Shopping Cart</span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-1">
                  Shopping Cart
                </h1>
                <p className="text-lg text-muted-foreground">
                  {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {cart.cartItems.map((item) => {
              const isUpdating = updatingItems.has(item.cartItemId);

              return (
                <Card
                  key={item.cartItemId}
                  className="p-6 transition-all duration-200 hover:shadow-md bg-card border border-[var(--border)] rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image Placeholder */}
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="w-full sm:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-lg flex items-center justify-center"
                      />
                    ) : (
                      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-lg flex items-center justify-center">
                        <Package className="w-12 h-12 text-primary/40" />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      {/* Product Name and Remove Button */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold leading-tight">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => removeItemFromCart(item.cartItemId)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-muted-foreground">
                          Price:
                        </span>
                        <span className="text-lg font-bold">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {/* Quantity Controls and Total */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-2 border border-[var(--border)] rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateItemQuantity(
                                  item.cartItemId,
                                  item.quantity - 1
                                )
                              }
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value);
                                if (!isNaN(newQty) && newQty > 0) {
                                  updateItemQuantity(item.cartItemId, newQty);
                                }
                              }}
                              className="w-16 h-8 text-center border-0 focus-visible:ring-0 p-0"
                              disabled={isUpdating}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateItemQuantity(
                                  item.cartItemId,
                                  item.quantity + 1
                                )
                              }
                              disabled={isUpdating}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-muted-foreground">
                            Total:
                          </span>
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 shadow-lg bg-card border border-[var(--border)] rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(cart.totalCartPrice + cart.totalDiscount)}
                  </span>
                </div>

                {/* Discount */}
                {cart.totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -{formatPrice(cart.totalDiscount)}
                    </span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatPrice(cart.totalCartPrice)}
                  </span>
                </div>

                {/* Items Count */}
                <div className="text-sm text-muted-foreground text-center">
                  {cart.totalQuantity}{" "}
                  {cart.totalQuantity === 1 ? "item" : "items"} •{" "}
                  {cart.totalItems}{" "}
                  {cart.totalItems === 1 ? "product" : "products"}
                </div>

                <Separator />

                {/* Checkout Button */}
                <Button
                  className="w-full text-base font-semibold h-12 gap-2"
                  size="lg"
                  onClick={() => {
                    toast.info("Checkout functionality coming soon!");
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Button>

                {/* Continue Shopping Link */}
                <Link href="/product">
                  <Button
                    variant="outline"
                    className="w-full text-base font-medium"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                <Separator />
                {/* Clear Cart Button */}
                <Button
                  variant="destructive"
                  className="w-full text-base font-medium gap-2"
                  size="lg"
                  onClick={openModal}
                >
                  <X className="w-5 h-5" />
                  Clear Cart
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Free shipping on orders over EGP 500</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Clear Cart"
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={closeModal}
              className="w-full text-base font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClearCart}
              className="w-full text-base font-medium"
            >
              Clear Cart
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to clear your entire cart? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
