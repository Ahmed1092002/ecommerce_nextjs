import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Your Store! 🛍️
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop now and enjoy
            fast shipping!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-orange-500 hover:text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
              >
                🛒 Shop Now
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-8 py-6 shadow-xl transition-all"
              >
                ✨ Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            Why Shop With Us? ⭐
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-t-4 border-blue-500">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Fast Delivery
              </h3>
              <p className="text-slate-600">
                Get your orders delivered quickly and safely to your doorstep.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-t-4 border-orange-500">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Quality Products
              </h3>
              <p className="text-slate-600">
                We guarantee the best quality products from trusted sellers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-t-4 border-blue-500">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Secure Payment
              </h3>
              <p className="text-slate-600">
                Shop with confidence using our secure payment methods.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
