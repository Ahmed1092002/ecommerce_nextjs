import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
export function Navbar() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 flex justify-center items-center border-[var(--border)]",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm"
          : "bg-background border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-(--primary)">
              E-STORE
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link
              href="/shop"
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              variant={"search"}
              placeholder="Search products..."
              className="w-64 pl-9 rounded-full bg-secondary/50 border-none focus-visible:ring-1"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          {user && (
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <Link href="/shop" className="hover:text-primary">
                  Shop
                </Link>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
