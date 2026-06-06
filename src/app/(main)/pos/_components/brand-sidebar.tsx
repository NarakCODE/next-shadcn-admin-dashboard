"use client";

import { ArchiveX, FolderHeart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ProductCard } from "./product-card";
import type { CartItem, Product } from "./types";

interface BrandSidebarProps {
  brands: string[];
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
  products: Product[];
  cart: CartItem[];
  onProductClick: (product: Product) => void;
  statusText?: string;
}

export function BrandSidebar({
  brands,
  selectedBrand,
  onBrandSelect,
  products,
  cart,
  onProductClick,
  statusText = "No Products to display",
}: BrandSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 w-90 flex-col border-border/80 border-l bg-background shadow-2xl xl:w-180">
      {/* Brand Header */}
      <div className="flex items-center gap-2 border-border/80 border-b bg-muted/20 p-4">
        <FolderHeart className="size-4.5 text-primary" />
        <span className="font-bold text-foreground text-sm tracking-tight">Brands Catalog</span>
      </div>

      {/* Brand List Pills */}
      <div className="shrink-0 border-border/60 border-b bg-muted/10 p-3">
        <div className="flex max-h-[120px] flex-wrap gap-1.5 overflow-y-auto">
          <Button
            type="button"
            variant={selectedBrand === "all" ? "default" : "outline"}
            size="xs"
            onClick={() => onBrandSelect("all")}
            className="h-7 cursor-pointer px-2.5 font-semibold text-[11px]"
          >
            All Brands
          </Button>
          {brands.map((brand) => (
            <Button
              key={brand}
              type="button"
              variant={selectedBrand === brand ? "default" : "outline"}
              size="xs"
              onClick={() => onBrandSelect(brand)}
              className="h-7 cursor-pointer px-2.5 font-semibold text-[11px]"
            >
              {brand}
            </Button>
          ))}
        </div>
      </div>

      {/* Products list scrollable */}
      <ScrollArea className="min-h-0 flex-1 bg-muted/5 p-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center text-muted-foreground">
            <ArchiveX className="mb-3 size-10 stroke-1 text-muted-foreground/50" />
            <p className="font-bold text-foreground text-xs uppercase tracking-wider">{statusText}</p>
            <p className="mt-1 max-w-[200px] text-[11px] text-muted-foreground">
              Try choosing another brand or adding a new product above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {products.map((product) => {
              const cartCount = cart.find((item) => item.product.id === product.id)?.quantity || 0;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartCount={cartCount}
                  onClick={() => onProductClick(product)}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
