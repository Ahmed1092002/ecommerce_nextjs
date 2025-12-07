export interface CartItem {
  cartItemId: number;
  image: string;
  name: string;
  price: number;
  productId: number;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  cart: {
    cartItems: CartItem[];
    totalCartPrice: number;
    totalDiscount: number;
    totalItems: number;
    totalQuantity: number;
  };
}

export interface AddToCartData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
