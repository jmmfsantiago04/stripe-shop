export type CartItem = {
    productId: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string;
    quantity: number;
  };
  
  export const CART_STORAGE_KEY = "stripe-shop-cart";