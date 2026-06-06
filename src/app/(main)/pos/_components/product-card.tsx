"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import { getProductImage } from "./product-image";
import type { Product } from "./types";

interface ProductCardProps {
  product: Product;
  cartCount: number;
  onClick: () => void;
}

export function ProductCard({ product, cartCount, onClick }: ProductCardProps) {
  const imageUrl = getProductImage(product);

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to cart`}
      className="group min-w-0 cursor-pointer select-none rounded-lg p-1.5 text-left transition-colors duration-200 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      onClick={onClick}
    >
      <figure className="relative aspect-square w-full overflow-hidden rounded-md border border-transparent bg-muted transition-[border-color,box-shadow] duration-200 group-hover:border-primary/30 group-hover:shadow-md">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 240px"
          className="object-cover transition-[filter] duration-200 group-hover:brightness-95"
        />
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 max-w-[calc(100%-3rem)] truncate border-white/20 bg-white/70 text-[10px] shadow-sm backdrop-blur-sm dark:bg-black/60"
        >
          {product.category}
        </Badge>

        {cartCount > 0 && (
          <Badge className="absolute top-2 right-2 size-7 justify-center rounded-full border border-foreground">
            {cartCount}
          </Badge>
        )}
      </figure>

      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="line-clamp-2 min-w-0 font-medium text-sm leading-snug transition-colors group-hover:text-primary">
          {product.name}
        </p>
        <p className="shrink-0 font-medium text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span className="truncate font-mono uppercase tracking-wide">{product.sku}</span>
        <span className={product.stock <= 5 ? "shrink-0 font-medium text-destructive" : "shrink-0"}>
          {product.stock} in stock
        </span>
      </div>
    </button>
  );
}
