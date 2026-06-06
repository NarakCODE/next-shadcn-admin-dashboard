export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  color: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
