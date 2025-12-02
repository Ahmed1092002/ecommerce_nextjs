"use client";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/shared/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Home,
  Package,
  LayoutGrid,
  List,
} from "lucide-react";

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

export default function Product() {
  const router = useRouter();
  const { getCustomerProducts, Loading: loadingProducts } = useProduct();
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [searchName, setSearchName] = useState<string>("");
  const [sortedColumn, setSortedColumn] = useState<string>("name");
  const [ascending, setAscending] = useState<boolean>(true);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

      const res = (await getCustomerProducts(
        params
      )) as unknown as PaginatedProducts;
      setItems(res?.data || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
      setPage(res?.pageNumber || 1);
    } catch (err) {
      console.error("Failed to load seller products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page]);

  // Check if any filters are active
  const hasActiveFilters =
    searchName ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortedColumn !== "name" ||
    !ascending;

  // Remove individual filter
  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case "search":
        setSearchName("");
        break;
      case "minPrice":
        setMinPrice("");
        break;
      case "maxPrice":
        setMaxPrice("");
        break;
      case "sort":
        setSortedColumn("name");
        setAscending(true);
        break;
    }
    setPage(1);
    setTimeout(() => load(1), 0);
  };

  // Generate pagination items with ellipsis
  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (page <= 3) {
        items.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (page >= totalPages - 2) {
        items.push(
          1,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        items.push(
          1,
          "ellipsis",
          page - 1,
          page,
          page + 1,
          "ellipsis",
          totalPages
        );
      }
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-card border-b border-[var(--border)] mb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Products</span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Discover Our Products
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse through our collection of quality products
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>

          {/* Results Count & Active Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {loadingProducts ? (
                  "Loading..."
                ) : (
                  <>
                    Showing <span className="font-bold">{items.length}</span> of{" "}
                    <span className="font-bold">{totalElements}</span> products
                  </>
                )}
              </span>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchName && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchName}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFilter("search")}
                    />
                  </Badge>
                )}
                {minPrice !== "" && (
                  <Badge variant="secondary" className="gap-1">
                    Min: ${minPrice}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFilter("minPrice")}
                    />
                  </Badge>
                )}
                {maxPrice !== "" && (
                  <Badge variant="secondary" className="gap-1">
                    Max: ${maxPrice}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFilter("maxPrice")}
                    />
                  </Badge>
                )}
                {(sortedColumn !== "name" || !ascending) && (
                  <Badge variant="secondary" className="gap-1">
                    Sort: {sortedColumn} {ascending ? "↑" : "↓"}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFilter("sort")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-card p-6 rounded-xl border border-[var(--border)] shadow-sm sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>

              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPage(1);
                  load(1);
                }}
              >
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Search Products
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Search by name..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sort By</Label>
                  <div className="flex gap-2">
                    <Select
                      value={sortedColumn}
                      onValueChange={setSortedColumn}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent className="bg-amber-50 border border-[var(--border)]">
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="createdAt">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setAscending((s) => !s)}
                      title={ascending ? "Ascending" : "Descending"}
                      className="shrink-0"
                    >
                      {ascending ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Price Range</Label>
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
                    <span className="text-muted-foreground font-medium">—</span>
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

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)]">
                  <Button type="submit" className="w-full font-semibold">
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSearchName("");
                      setSortedColumn("name");
                      setAscending(true);
                      setMinPrice("");
                      setMaxPrice("");
                      setPage(1);
                      load(1);
                    }}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </form>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {loadingProducts ? (
                // Show skeleton placeholders while loading
                Array.from({ length: pageSize }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-xl" />
                ))
              ) : items.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
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
                    Clear Filters
                  </Button>
                </div>
              ) : (
                items.map((it) => (
                  <ProductCard
                    buttonTitle="View Details"
                    onButtonClick={() =>
                      router.push(`/product/${it.id}`)
                    }
                    link={`/product/${it.id}`}
                    key={String(it.id)}
                    showAddToCartButton={true}
                    onAddToCartClick={() => {
                      console.log("Add to cart clicked for product:", it);
                    }}
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
            {totalPages > 1 && !loadingProducts && (
              <div className="mt-12 mb-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage((p) => p - 1);
                        }}
                        aria-disabled={page <= 1}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    {generatePaginationItems().map((item, idx) => {
                      if (item === "ellipsis") {
                        return (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      const pageNumber = item as number;
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
                          if (page < totalPages) setPage((p) => p + 1);
                        }}
                        aria-disabled={page >= totalPages}
                        className={
                          page >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
