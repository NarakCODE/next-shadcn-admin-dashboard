"use client";

import type React from "react";
import { useState } from "react";

import { BarcodeIcon, Grid, Plus, SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Product } from "./types";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
  onBrowseToggle?: () => void;
}

export function ProductSearch({ searchQuery, onSearchChange, onAddProduct, onBrowseToggle }: ProductSearchProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New product form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [brand, setBrand] = useState("Apple");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("10");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    const priceNum = Number.parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const skuValue = sku.trim() || `PROD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price: priceNum,
      category,
      brand,
      sku: skuValue,
      stock: Number.parseInt(stock, 10) || 0,
      color: "bg-blue-500/10 text-blue-500", // Default color class
    };

    onAddProduct(newProd);
    setIsDialogOpen(false);

    // Reset fields
    setName("");
    setPrice("");
    setSku("");
    setStock("10");

    toast.success(`Product "${name}" added to inventory!`);
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label>Product Search</Label>
        <div className="flex items-center gap-2">
          {onBrowseToggle && (
            <Button
              variant="link"
              size="sm"
              type="button"
              onClick={onBrowseToggle}
              className="h-auto gap-1 p-0 font-semibold text-primary text-xs hover:no-underline"
            >
              <Grid className="size-3" />
              Browse Products
            </Button>
          )}
          <Button variant="link" size="sm" type="button" onClick={() => setIsDialogOpen(true)}>
            <Plus />
            Add new product
          </Button>
        </div>
      </div>

      <Field className="w-full">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products by name or SKU..."
            aria-label="Search products"
            className="text-xs"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Scan product barcode">
              <BarcodeIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {/* Add New Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
          <form onSubmit={handleCreateProduct}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="size-5 text-primary" />
                Add New Product
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prodName" className="text-right text-xs">
                  Name *
                </Label>
                <Input
                  id="prodName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Charger"
                  className="col-span-3 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prodPrice" className="text-right text-xs">
                  Price ($) *
                </Label>
                <Input
                  id="prodPrice"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 29.99"
                  className="col-span-3 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prodCategory" className="text-right text-xs">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="col-span-3 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prodBrand" className="text-right text-xs">
                  Brand
                </Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="col-span-3 text-xs">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACLEDA Bank">ACLEDA Bank</SelectItem>
                    <SelectItem value="Coca-Cola">Coca-Cola</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Samsung">Samsung</SelectItem>
                    <SelectItem value="Nike">Nike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prodSku" className="text-right text-xs">
                  SKU
                </Label>
                <Input
                  id="prodSku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Leave blank for auto SKU"
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prodStock" className="text-right text-xs">
                  Stock
                </Label>
                <Input
                  id="prodStock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="col-span-3 text-xs"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs">
                Save Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
