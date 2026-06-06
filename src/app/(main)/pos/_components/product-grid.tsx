"use client";

import { Layers } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProductCard } from "./product-card";
import type { CartItem, Product } from "./types";

interface ProductGridProps {
  filteredProducts: Product[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  cart: CartItem[];
  onProductClick: (product: Product) => void;
}

export function ProductGrid({
  filteredProducts,
  selectedCategory,
  onCategoryChange,
  cart,
  onProductClick,
}: ProductGridProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Category Controls */}
      <div className="mb-4">
        <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 space-x-1 overflow-x-auto md:flex md:w-auto">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="Electronics">Electronics</TabsTrigger>
            <TabsTrigger value="Lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="Apparel">Apparel</TabsTrigger>
            <TabsTrigger value="Food & Beverage">F&B</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Products Display Grid */}
      <ScrollArea className="flex-1 rounded-xl border border-border bg-background p-4 shadow-inner">
        {filteredProducts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Layers className="mb-2 h-10 w-10 text-muted-foreground/60" />
            <p className="font-medium text-muted-foreground">No matching inventory items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
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
    </div>
  );
}
