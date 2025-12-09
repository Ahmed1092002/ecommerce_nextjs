import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Aura Shop",
  description:
    "Learn how Aura Shop blends curated products, fast delivery, and thoughtful service for modern shoppers.",
};

const highlights = [
  {
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    title: "Curated Essentials",
    body: "Every drop is handpicked by our team to balance quality, value, and timeless design.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
    title: "Protected Purchases",
    body: "Secure checkout, clear returns, and proactive support keep every order stress-free.",
  },
  {
    icon: <Leaf className="h-5 w-5 text-primary" />,
    title: "Sustainable Steps",
    body: "From packaging choices to carbon-aware shipping, we keep lowering our footprint.",
  },
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: "Built with You",
    body: "We shape features with customer feedback, so the store evolves with your needs.",
  },
];

const stats = [
  { label: "Products Reviewed", value: "3.5k+" },
  { label: "Avg. Delivery", value: "2-3 days" },
  { label: "Support Rating", value: "4.9/5" },
  { label: "Countries Served", value: "12" },
];

const commitments = [
  {
    title: "Honest sourcing",
    body: "We work directly with makers and vetted suppliers to keep standards transparent.",
  },
  {
    title: "Fair pricing",
    body: "Dynamic discounts and bundles keep premium picks within reach without surprise fees.",
  },
  {
    title: "Careful delivery",
    body: "Real-time updates, insured parcels, and local partners so your order arrives right.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary/60 via-background to-background p-10 md:p-14">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            aria-hidden
          >
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-0 bottom-10 h-40 w-40 rounded-full bg-secondary/40 blur-3xl" />
          </div>
          <div className="flex flex-col gap-6 relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-primary">
              <HeartHandshake className="h-4 w-4" /> Trusted by modern shoppers
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-(--primary)">
              We built Aura Shop to make premium shopping feel effortless.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Aura Shop blends curated collections, responsive support, and fast
              delivery so you can focus on finding pieces you love—not fighting
              checkout flows.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button size="lg" className="px-7">
                  Browse the collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-7">
                  Talk with support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 grid gap-8 md:gap-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-(--primary)">
              Our story
            </h2>
            <p className="text-muted-foreground text-lg">
              We started Aura Shop after noticing how hard it was to find
              reliable products without wading through endless tabs. Today, our
              team of merchandisers tests every item, pairs it with honest
              descriptions, and ships from fulfillment partners that mirror our
              standards.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border bg-card p-4 shadow-sm"
                >
                  <div className="text-2xl font-bold text-(--primary)">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  {item.icon}
                </div>
                <div className="text-lg font-semibold text-(--primary)">
                  {item.title}
                </div>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6">
        <div className="rounded-3xl border bg-muted/40 p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <h3 className="text-2xl font-bold text-(--primary)">
                What guides us
              </h3>
              <p className="text-muted-foreground">
                We audit suppliers, iterate on packaging, and design features
                that simplify how you discover, track, and love your purchases.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-2 border">
                <Globe2 className="h-4 w-4" /> Global partners
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-2 border">
                <Leaf className="h-4 w-4" /> Eco-minded ops
              </div>
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-background border p-5 shadow-sm"
              >
                <div className="text-lg font-semibold text-(--primary)">
                  {item.title}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
