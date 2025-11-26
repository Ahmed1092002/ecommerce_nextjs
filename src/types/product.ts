export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  sellerId: string;
  sellerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  rating: number;
  quantity: number;
  discount: number;
}

export interface UpdateProductData {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  rating?: number;
  quantity?: number;
}
