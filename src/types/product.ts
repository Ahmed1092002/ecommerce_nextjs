export interface Product {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: ProductData[];
}
export interface ProductData {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number;
  finalPrice: number;
  inWishlist?: boolean;
}
interface PaginatedProducts {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
export interface SearchProductsParams {
  page?: number;
  size?: number;
  sortedColumn?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  ascending?: boolean;
}

export interface CreateProductData {
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface UpdateProductData {
  id: number;
  image?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  discount?: number;
  finalPrice?: number;
}
