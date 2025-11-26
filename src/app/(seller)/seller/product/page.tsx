import { Button } from "@/components/shared/Button";
import Link from "next/link";

export default function SellerProductPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Seller Product Page
        </h1>
        <Link href="/seller/product/create">
          <Button
            className={
              "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            }
          >
            Add New Product
          </Button>
        </Link>
      </div>
    </div>
  );
}
