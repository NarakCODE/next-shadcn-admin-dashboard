"use client";

import { useState } from "react";

import { ArchiveX, FolderHeart } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

const brandAvatarStyles = [
  "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
];

function getBrandInitials(brand: string) {
  return brand
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getBrandAvatarStyle(brand: string) {
  const index = Array.from(brand).reduce((total, character) => total + character.charCodeAt(0), 0);
  return brandAvatarStyles[index % brandAvatarStyles.length];
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <aside className="flex h-full min-h-0 w-90 flex-col border-border/80 border-l bg-background shadow-2xl xl:w-180">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-border/80 border-b bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <FolderHeart className="size-4.5 text-primary" />
          <span className="font-bold text-foreground text-sm tracking-tight">Brands Catalog</span>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="link"
              size="sm"
              className="h-auto cursor-pointer gap-1 p-0 font-semibold text-primary text-xs hover:no-underline"
            >
              View All Brands
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <FolderHeart />
                All Brands
              </SheetTitle>
              <SheetDescription>Select a brand to filter the products available in this register.</SheetDescription>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1 px-4">
              <div className="flex flex-col gap-2 pb-4">
                <SheetClose asChild>
                  <Button
                    type="button"
                    size="lg"
                    variant={selectedBrand === "all" ? "default" : "outline"}
                    onClick={() => onBrandSelect("all")}
                    className="w-full justify-start gap-3"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>
                        <FolderHeart />
                      </AvatarFallback>
                    </Avatar>
                    All Brands
                  </Button>
                </SheetClose>

                {brands.map((brand) => (
                  <SheetClose key={brand} asChild>
                    <Button
                      type="button"
                      size="lg"
                      variant={selectedBrand === brand ? "default" : "outline"}
                      onClick={() => onBrandSelect(brand)}
                      className="w-full justify-start gap-3"
                    >
                      <Avatar size="sm">
                        <AvatarFallback className={getBrandAvatarStyle(brand)}>
                          {getBrandInitials(brand)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{brand}</span>
                    </Button>
                  </SheetClose>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Brand List Pills */}
      <div className="shrink-0 border-border/60 border-b bg-muted/10 p-3">
        <div className="flex max-h-[120px] flex-wrap gap-1.5 overflow-y-auto">
          <Button
            type="button"
            variant={selectedBrand === "all" ? "default" : "outline"}
            size="lg"
            onClick={() => onBrandSelect("all")}
            className="cursor-pointer gap-2 pl-2"
          >
            <Avatar className="size-6" size="sm">
              <AvatarFallback className="bg-background/80 text-foreground">
                <FolderHeart className="size-3" />
              </AvatarFallback>
            </Avatar>
            All Brands
          </Button>
          {brands.map((brand) => (
            <Button
              key={brand}
              type="button"
              variant={selectedBrand === brand ? "default" : "outline"}
              size="lg"
              onClick={() => onBrandSelect(brand)}
              className="cursor-pointer gap-2 pl-2"
            >
              <Avatar className="size-6" size="sm">
                <AvatarFallback className={getBrandAvatarStyle(brand)}>{getBrandInitials(brand)}</AvatarFallback>
              </Avatar>
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
