"use client";

import Image from "next/image";

import { Minus, Plus, RotateCcw, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getProductImage } from "./product-image";
import type { CartItem, Product } from "./types";

interface CartListProps {
  cart: CartItem[];
  onClearCart: () => void;
  onUpdateQuantity: (productId: string, amount: number) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
}

export function CartList({ cart, onClearCart, onUpdateQuantity, onAddToCart, onRemoveFromCart }: CartListProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-border border-b bg-muted/10 px-4 py-2">
        <span>Current Order</span>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="h-7 text-destructive text-xs hover:bg-destructive/10"
          >
            <RotateCcw className="mr-1 h-3 w-3" /> Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {cart.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
            <ShoppingBag className="mb-2 h-12 w-12 stroke-1 text-muted-foreground/40" />
            <p className="font-medium text-sm">Active register allocation empty</p>
            <p className="mt-1 max-w-[200px] text-xs">Select items from the matrix to start transaction pipeline</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 p-2"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={getProductImage(item.product)}
                      alt={item.product.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-medium text-foreground text-xs">{item.product.name}</p>
                    <p className="mt-0.5 font-bold text-muted-foreground text-xs">
                      ${item.product.price.toFixed(2)} <span className="font-normal text-[10px]">each</span>
                    </p>
                  </div>
                </div>

                <div className="flex h-full min-h-[50px] flex-col items-end justify-between">
                  <div className="flex h-7 items-center overflow-hidden rounded-md border border-border bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full w-7 rounded-none"
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium font-mono text-xs">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full w-7 rounded-none"
                      onClick={() => onAddToCart(item.product)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="mt-1 flex items-center gap-3">
                    <span className="font-bold font-mono text-xs">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
