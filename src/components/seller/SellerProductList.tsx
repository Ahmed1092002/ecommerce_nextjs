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
  // send two params: sortedColumn and ascending (boolean). Default ascending = true
  const [sortedColumn, setSortedColumn] = useState<string>("name");
  const [ascending, setAscending] = useState<boolean>(true);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  async function load(p = page) {
    setLoading(true);
    try {
      // getSellerProducts will append query params to the endpoint
      const params: Record<string, string | number | boolean | undefined> = {
        page: p,
        size: pageSize,
      };
      if (searchName) params.name = searchName;
      // send two separate params for backend: sortedColumn and ascending
      if (sortedColumn) params.sortedColumn = sortedColumn;
      params.ascending = ascending;
      if (minPrice !== "") params.minPrice = minPrice;
      if (maxPrice !== "") params.maxPrice = maxPrice;

      const res = (await getSellerProducts(
        params
      )) as unknown as PaginatedProducts;
      setItems(res?.data || []);
      setTotalPages(res?.totalPages ?? 1);
      // Ensure page is 1-based in UI
      setPage(res?.pageNumber ?? p);
    } catch (err) {
      console.error("Failed to load seller products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <form
        className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          // apply filters and reset to page 1
          setPage(1);
          load(1);
        }}
      >
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Search Name</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Search product name"
          />
        </div>

        <div className="w-56 flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Sort Column
            </label>
            <select
              value={sortedColumn}
              onChange={(e) => setSortedColumn(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="createdAt">Created At</option>
            </select>
          </div>

          <div className="w-20 text-center">
            <label className="block text-sm font-medium mb-1">Order</label>
            <button
              type="button"
              className="w-full rounded border px-3 py-2"
              onClick={() => setAscending((s) => !s)}
              aria-pressed={!ascending}
            >
              {ascending ? "Asc" : "Desc"}
            </button>
          </div>
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <input
            type="number"
            value={minPrice === "" ? "" : String(minPrice)}
            onChange={(e) =>
              setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full rounded border px-3 py-2"
            placeholder="0"
            min={0}
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input
            type="number"
            value={maxPrice === "" ? "" : String(maxPrice)}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full rounded border px-3 py-2"
            placeholder="0"
            min={0}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded"
          >
            Search
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 bg-gray-200 rounded"
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
            Reset
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && <div>Loading...</div>}
        {!loading && items.length === 0 && <div>No products found.</div>}
        {items.map((it) => (
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
        ))}
      </div>

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
