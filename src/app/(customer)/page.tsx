import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, ShieldCheck, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-secondary/30 py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              New Collection 2025
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-(--primary)">
              Elevate Your Style with{" "}
              <span className="text-primary">Premium Essentials</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px]">
              Discover our curated collection of high-quality products designed
              for the modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/product">
                <Button size="lg" className="h-12 px-8 text-base">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="features_card">
            <div className="p-3 rounded-full bg-secondary mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
            <p className="text-(--muted-foreground)">
              Free shipping on all orders over $100.
            </p>
          </div>
          <div className="features_card">
            <div className="p-3 rounded-full bg-secondary mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
            <p className="text-(--muted-foreground)">
              100% secure payment processing.
            </p>
          </div>
          <div className="features_card">
            <div className="p-3 rounded-full bg-secondary mb-4">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Quality Guarantee</h3>
            <p className="text-(--muted-foreground)">
              30-day money-back guarantee on all items.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-(--primary)">
            Featured Products
          </h2>
          <Link href="/shop">
            <Button variant="destructive">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for ProductCards - In a real app, map through products here */}
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            Product Grid will appear here
          </div>
        </div>
      </section>
    </div>
  );
}
