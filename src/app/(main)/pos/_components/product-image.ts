import type { Product } from "./types";

const categoryImages: Record<string, string> = {
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=640&q=80",
  Lifestyle: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=640&q=80",
  Apparel: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=640&q=80",
  "Food & Beverage": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=640&q=80",
};

const fallbackImage = "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=640&q=80";

export function getProductImage(product: Product) {
  return product.imageUrl ?? categoryImages[product.category] ?? fallbackImage;
}
