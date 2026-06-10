import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "../../../public/images/logo-white.png";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-background flex justify-center items-center">
      <div className="container px-4 md:px-6 py-16">
        <div className="gap-8 flex justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Aura Shop Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <h3 className="text-lg font-bold">Aura Shop</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium e-commerce experience for modern shoppers. Quality
              products, fast shipping, and excellent support.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Stay Updated</h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-[200px] bg-secondary/50 border-none"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Aura Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
