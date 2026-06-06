"use client";

import Image from "next/image";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getProductImage } from "./product-image";
import type { CartItem, Product } from "./types";

interface CartTableProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, amount: number) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  exchangeRate: number;
}

export function CartTable({ cart, onUpdateQuantity, onAddToCart, onRemoveFromCart, exchangeRate }: CartTableProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-background/50 shadow-xs">
      <div className="flex items-center justify-between border-border/60 border-b bg-muted/40 px-4 py-3">
        <span className="font-semibold text-muted-foreground text-xs tracking-wider">Current Order</span>
        <span className="font-medium text-muted-foreground text-xs">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
        </span>
      </div>

      <ScrollArea className="flex-1">
        {cart.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <div className="mb-3 rounded-full bg-muted/30 p-4 text-muted-foreground/50">
              <ShoppingBag className="size-10 stroke-1" />
            </div>
            <p className="font-semibold text-foreground text-sm">Active register empty</p>
            <p className="mt-1 max-w-[240px] text-muted-foreground text-xs">
              Select products from the catalog or search to start a transaction.
            </p>
          </div>
        ) : (
          <div className="w-full min-w-[500px]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-border/50 border-b bg-muted/20 font-semibold text-[10px] text-muted-foreground tracking-wider">
                  <th className="px-4 py-2.5 font-semibold">Product</th>
                  <th className="w-28 px-4 py-2.5 text-center font-semibold">Quantity</th>
                  <th className="w-28 px-4 py-2.5 text-right font-semibold">Subtotal</th>
                  <th className="w-20 px-4 py-2.5 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {cart.map((item) => {
                  const usdSub = item.product.price * item.quantity;
                  const rielSub = Math.round(usdSub * exchangeRate);
                  return (
                    <tr key={item.product.id} className="group transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={getProductImage(item.product)}
                              alt={item.product.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-semibold text-foreground text-sm leading-tight">
                              {item.product.name}
                            </span>
                            <span className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                              {item.product.sku} • ${item.product.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="mx-auto flex h-8 w-24 items-center justify-center overflow-hidden rounded-lg border border-border/80 bg-background shadow-xs">
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-full w-8 rounded-none border-border/40 border-r hover:bg-muted"
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="flex-1 text-center font-bold font-mono text-foreground text-xs">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-full w-8 rounded-none border-border/40 border-l hover:bg-muted"
                            onClick={() => onAddToCart(item.product)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col">
                          <span className="font-bold font-mono text-foreground text-sm">${usdSub.toFixed(2)}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            ៛{rielSub.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          onClick={() => onRemoveFromCart(item.product.id)}
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
