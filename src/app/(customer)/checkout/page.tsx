"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";
import useAddress from "@/hooks/useAddress";
import { CartData } from "@/types/cart";
import { AddressData } from "@/types/address";
import { PaymentMethod } from "@/types/order";
import { Loading } from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/utils/helpers";
import Modal from "@/components/shared/modal";
import {
  Home,
  ChevronRight,
  MapPin,
  CreditCard,
  ShoppingCart,
  Package,
  Plus,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { getCart } = useCart();
  const { handleCheckOut } = useOrder();
  const { getCustomerAddresses } = useAddress();

  const [cart, setCart] = useState<CartData | null>(null);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [shippingAddressId, setShippingAddressId] = useState<string>("");
  const [billingAddressId, setBillingAddressId] = useState<string>("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH_ON_DELIVERY
  );
  const [paymentMethodValue, setPaymentMethodValue] = useState<string>(
    PaymentMethod.CASH_ON_DELIVERY.toString()
  );
  console.log("paymentMethodValue", paymentMethodValue);

  async function loadData() {
    setLoading(true);
    try {
      const [cartData, addressData] = await Promise.all([
        getCart(),
        getCustomerAddresses(1),
      ]);

      setCart(cartData);
      setAddresses(addressData.data || []);

      // Set default addresses if available
      const defaultAddress = addressData.data?.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setShippingAddressId(defaultAddress.id);
        setBillingAddressId(defaultAddress.id);
      }
    } catch (error) {
      toast.error("Failed to load checkout data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    if (!shippingAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    const finalBillingAddressId = sameAsShipping
      ? shippingAddressId
      : billingAddressId;

    if (!finalBillingAddressId) {
      toast.error("Please select a billing address");
      return;
    }
    console.log("paymentMethodValue", paymentMethodValue);
    setSubmitting(true);
    try {
      const order = await handleCheckOut({
        shippingAddressId: Number(shippingAddressId),
        billingAddressId: Number(finalBillingAddressId),
        paymentMethod: paymentMethodValue,
      });

      toast.success("Order placed successfully!");
      router.push(`/profile/orders/${order.id}`);
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddressId(shippingAddressId);
    }
  }, [sameAsShipping, shippingAddressId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Add items to your cart before checking out
          </p>
          <Button onClick={() => router.push("/product")}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-[var(--border)] mb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <Link href="/cart" className="hover:text-foreground">
              Cart
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="p-6 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-2xl font-bold">Shipping Address</h2>
                </div>
                {addresses.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressModal(true)}
                    className="gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Browse All
                  </Button>
                )}
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <div className="bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4 font-medium">
                    No addresses found. Please add an address first.
                  </p>
                  <Link href="/profile/addresses">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Address
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Selected Address Display */}
                  {shippingAddressId &&
                    (() => {
                      const selectedAddress = addresses.find(
                        (addr) => addr.id === shippingAddressId
                      );
                      if (!selectedAddress) return null;

                      return (
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary rounded-xl p-5 mb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-lg">
                                  {selectedAddress.label}
                                </span>
                                {selectedAddress.isDefault && (
                                  <span className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                  <span className="text-muted-foreground min-w-[80px]">
                                    Street:
                                  </span>
                                  <span className="font-medium">
                                    {selectedAddress.street}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-muted-foreground min-w-[80px]">
                                    City:
                                  </span>
                                  <span className="font-medium">
                                    {selectedAddress.city},{" "}
                                    {selectedAddress.state}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-muted-foreground min-w-[80px]">
                                    Country:
                                  </span>
                                  <span className="font-medium">
                                    {selectedAddress.country}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-muted-foreground min-w-[80px]">
                                    Phone:
                                  </span>
                                  <span className="font-medium">
                                    {selectedAddress.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAddressModal(true)}
                              className="shrink-0"
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                      );
                    })()}

                  {/* Quick Select - First 3 Addresses */}
                  {!shippingAddressId && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        Quick select from recent addresses:
                      </p>
                      {addresses.slice(0, 3).map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setShippingAddressId(address.id)}
                          className="group flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {address.street}, {address.city}, {address.state}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <Link href="/profile/addresses" className="block mt-6">
                <Button variant="outline" className="w-full gap-2 h-11">
                  <Plus className="w-4 h-4" />
                  Add New Address
                </Button>
              </Link>
            </Card>

            {/* Billing Address */}
            <Card className="p-6 border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5" />
                <h2 className="text-2xl font-bold">Billing Address</h2>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="same-as-shipping"
                  checked={sameAsShipping}
                  onCheckedChange={(checked) =>
                    setSameAsShipping(checked as boolean)
                  }
                />
                <Label
                  htmlFor="same-as-shipping"
                  className="text-sm font-medium cursor-pointer"
                >
                  Same as shipping address
                </Label>
              </div>

              {!sameAsShipping && addresses.length > 0 && (
                <RadioGroup
                  value={billingAddressId}
                  onValueChange={setBillingAddressId}
                  className="space-y-4 mt-4"
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`group relative flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        billingAddressId === address.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
                      }`}
                      onClick={() => setBillingAddressId(address.id)}
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={`billing-${address.id}`}
                        className="mt-1.5"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`billing-${address.id}`}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-base">
                              {address.label}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                            <p className="font-medium text-foreground">
                              {address.street}
                            </p>
                            <p>
                              {address.city}, {address.state}
                            </p>
                            <p>{address.country}</p>
                            <p className="flex items-center gap-1.5 pt-1">
                              <span className="text-xs">📞</span>
                              {address.phone}
                            </p>
                          </div>
                        </Label>
                      </div>
                      {billingAddressId === address.id && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}
            </Card>

            {/* Payment Method */}
            <Card className="p-6 border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5" />
                <h2 className="text-2xl font-bold">Payment Method</h2>
              </div>

              <RadioGroup
                value={PaymentMethod[paymentMethod]}
                onValueChange={(value) => {
                  const enumValue =
                    PaymentMethod[value as keyof typeof PaymentMethod];
                  setPaymentMethod(enumValue);
                }}
                className="space-y-4"
              >
                {Object.keys(PaymentMethod)
                  .filter((key) => isNaN(Number(key)))
                  .map((method) => {
                    const isSelected = PaymentMethod[paymentMethod] === method;
                    const icons: Record<string, string> = {
                      CREDIT_CARD: "💳",
                      DEBIT_CARD: "💳",
                      PAYPAL: "🅿️",
                      CASH_ON_DELIVERY: "💵",
                      BANK_TRANSFER: "🏦",
                    };
                    return (
                      <div
                        key={method}
                        className={`group relative flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:shadow-sm"
                        }`}
                        onClick={() => {
                          const enumValue =
                            PaymentMethod[method as keyof typeof PaymentMethod];
                          console.log(enumValue);
                          console.log("method", method);

                          setPaymentMethodValue(method.toString());

                          setPaymentMethod(enumValue);
                        }}
                      >
                        <RadioGroupItem
                          value={method}
                          id={`payment-${method}`}
                        />
                        <Label
                          htmlFor={`payment-${method}`}
                          className="cursor-pointer font-semibold text-base flex items-center gap-2 flex-1"
                        >
                          <span className="text-xl">
                            {icons[method] || "💰"}
                          </span>
                          {method.replace(/_/g, " ")}
                        </Label>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </RadioGroup>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 border border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted border border-[var(--border)]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(cart.totalCartPrice + cart.totalDiscount)}
                  </span>
                </div>

                {cart.totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -{formatPrice(cart.totalDiscount)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatPrice(cart.totalCartPrice)}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  {cart.totalQuantity}{" "}
                  {cart.totalQuantity === 1 ? "item" : "items"}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Place Order Button */}
              <Button
                className="w-full text-base font-semibold h-12 gap-2"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={
                  submitting ||
                  !shippingAddressId ||
                  (!sameAsShipping && !billingAddressId)
                }
              >
                {submitting ? "Placing Order..." : "Place Order"}
                <ArrowRight className="w-5 h-5" />
              </Button>

              {/* Back to Cart */}
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="w-full text-base font-medium mt-3"
                  size="lg"
                >
                  Back to Cart
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Select Shipping Address"
        maxWidth="2xl"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => {
                setShippingAddressId(address.id);
                setShowAddressModal(false);
              }}
              className={`group relative flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                shippingAddressId === address.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50 hover:shadow-sm"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-base">{address.label}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                  <p className="font-medium text-foreground">
                    {address.street}
                  </p>
                  <p>
                    {address.city}, {address.state}
                  </p>
                  <p>{address.country}</p>
                  <p className="flex items-center gap-1.5 pt-1">
                    <span className="text-xs">📞</span>
                    {address.phone}
                  </p>
                </div>
              </div>
              {shippingAddressId === address.id && (
                <div className="absolute top-3 right-3">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
