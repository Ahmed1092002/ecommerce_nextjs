// SellerProductList component with loading skeletons and proper imports
"use client";
import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { useProduct } from "@/hooks/useProduct";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type ApiItem = {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  discount?: number;
  finalPrice?: number;
};

type PaginatedProducts = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: ApiItem[];
};

export function SellerProductList() {
  const { getSellerProducts } = useProduct();
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [items, setItems] = useState<ApiItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [sortedColumn, setSortedColumn] = useState<string>("name");
  const [ascending, setAscending] = useState<boolean>(true);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  async function load(p = page) {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page: p,
        size: pageSize,
      };
      if (searchName) params.name = searchName;
      if (sortedColumn) params.sortedColumn = sortedColumn;
      params.ascending = ascending;
      if (minPrice !== "") params.minPrice = minPrice;
      if (maxPrice !== "") params.maxPrice = maxPrice;

      const res = (await getSellerProducts(
        params
      )) as unknown as PaginatedProducts;
      setItems(res?.data);
      setTotalPages(res?.totalPages);
      setPage(res?.pageNumber);
    } catch (err) {
      console.error("Failed to load seller products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col border-[var(--border)]">
          <span className="text-sm text-muted-foreground">Total Products</span>
          <span className="text-2xl font-bold">{items.length}</span>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col border-[var(--border)]">
          <span className="text-sm text-muted-foreground">Active Listings</span>
          <span className="text-2xl font-bold">
            {items.filter((i) => (i.quantity || 0) > 0).length}
          </span>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col border-[var(--border)]">
          <span className="text-sm text-muted-foreground">Low Stock</span>
          <span className="text-2xl font-bold text-orange-500">
            {items.filter((i) => (i.quantity || 0) < 5).length}
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-card p-6 rounded-lg border shadow-sm border-[var(--border)]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Filter Products</h2>
          <p className="text-sm text-muted-foreground">
            Refine your product list using the options below.
          </p>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            load(1);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Search Name</Label>
              <Input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search product name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <div className="flex gap-2">
                <Select value={sortedColumn} onValueChange={setSortedColumn}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-50 border border-[var(--border)]">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="createdAt">Created At</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setAscending((s) => !s)}
                  title={ascending ? "Ascending" : "Descending"}
                >
                  {ascending ? "↑" : "↓"}
                </Button>
              </div>
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
              <Label>Price Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minPrice === "" ? "" : String(minPrice)}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="Min"
                  min={0}
                  className="w-full"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={maxPrice === "" ? "" : String(maxPrice)}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="Max"
                  min={0}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end border-t border-[var(--border)] pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearchName("");
                setSortedColumn("name");
                setAscending(true);
                setMinPrice("");
                setMaxPrice("");
                setPage(1);
                load(1);
              }}
            >
              Reset Filters
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Show skeleton placeholders while loading
          Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No products found.
          </div>
        ) : (
          items.map((it) => (
            <ProductCard
              key={String(it.id)}
              product={{
                id: String(it.id),
                name: it.name,
                price: it.finalPrice ?? it.price,
                stock: typeof it.quantity === "number" ? it.quantity : 0,
                images: [],
              }}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                aria-disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
