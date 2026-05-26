"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import { Eye, Filter, Grid, List, Package, Search, ShoppingCart, SlidersHorizontal, Star, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Product = {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  rating: number;
  sku: string;
  createdAt: string;
};

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: 'MacBook Pro 16"',
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 2499.0,
    compareAtPrice: 2799.0,
    stock: 45,
    status: "in-stock",
    rating: 4.8,
    sku: "MBP-16-2024",
    createdAt: "2024-01-15",
  },
  {
    id: "prod-2",
    name: "iPhone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 1199.0,
    compareAtPrice: 1299.0,
    stock: 120,
    status: "in-stock",
    rating: 4.9,
    sku: "IP15-PM-256",
    createdAt: "2024-01-20",
  },
  {
    id: "prod-3",
    name: "Ergonomic Office Chair",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&h=300&dpr=2&q=80",
    category: "Furniture",
    price: 599.0,
    compareAtPrice: 699.0,
    stock: 8,
    status: "low-stock",
    rating: 4.5,
    sku: "EOC-BLK-001",
    createdAt: "2024-02-01",
  },
  {
    id: "prod-4",
    name: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 349.0,
    stock: 0,
    status: "out-of-stock",
    rating: 4.7,
    sku: "SNY-WH5-BLK",
    createdAt: "2024-02-05",
  },
  {
    id: "prod-5",
    name: "Standing Desk Pro",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=300&h=300&dpr=2&q=80",
    category: "Furniture",
    price: 899.0,
    stock: 32,
    status: "in-stock",
    rating: 4.6,
    sku: "SDP-WHT-60",
    createdAt: "2024-02-10",
  },
  {
    id: "prod-6",
    name: "Nike Air Max 270",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&dpr=2&q=80",
    category: "Footwear",
    price: 150.0,
    stock: 200,
    status: "in-stock",
    rating: 4.4,
    sku: "NKE-AM270-10",
    createdAt: "2024-02-15",
  },
  {
    id: "prod-7",
    name: "Mechanical Keyboard RGB",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 179.0,
    compareAtPrice: 199.0,
    stock: 5,
    status: "low-stock",
    rating: 4.6,
    sku: "MKB-RGB-CHX",
    createdAt: "2024-02-20",
  },
  {
    id: "prod-8",
    name: "Leather Messenger Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&dpr=2&q=80",
    category: "Accessories",
    price: 249.0,
    stock: 0,
    status: "out-of-stock",
    rating: 4.3,
    sku: "LMB-BRN-001",
    createdAt: "2024-02-25",
  },
  {
    id: "prod-9",
    name: '4K Monitor 32"',
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 699.0,
    stock: 28,
    status: "in-stock",
    rating: 4.7,
    sku: "4KM-32-USB",
    createdAt: "2024-03-01",
  },
  {
    id: "prod-10",
    name: "Wireless Mouse Pro",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 79.0,
    stock: 150,
    status: "in-stock",
    rating: 4.5,
    sku: "WMP-BLK-001",
    createdAt: "2024-03-05",
  },
  {
    id: "prod-11",
    name: "Yoga Mat Premium",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&dpr=2&q=80",
    category: "Fitness",
    price: 49.0,
    stock: 75,
    status: "in-stock",
    rating: 4.2,
    sku: "YMP-PRP-6MM",
    createdAt: "2024-03-10",
  },
  {
    id: "prod-12",
    name: "Smart Watch Ultra",
    image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=300&h=300&dpr=2&q=80",
    category: "Electronics",
    price: 799.0,
    compareAtPrice: 849.0,
    stock: 3,
    status: "low-stock",
    rating: 4.8,
    sku: "SWU-TIT-49",
    createdAt: "2024-03-15",
  },
];

const statusColors = {
  "in-stock": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "low-stock": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "out-of-stock": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function ProductsShopPage() {
  const [products] = useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number>(0);

  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(p.status);
        const matchesMinPrice = minPrice === "" || p.price >= minPrice;
        const matchesMaxPrice = maxPrice === "" || p.price <= maxPrice;
        const matchesRating = p.rating >= minRating;

        return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "price_low") return a.price - b.price;
        if (sortBy === "price_high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, search, selectedCategories, selectedStatuses, minPrice, maxPrice, minRating, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSortBy("featured");
  };

  const handleQuickAdd = (p: Product) => {
    toast.success("Added to Cart!", {
      description: `Successfully added 1x ${p.name} to checkout list.`,
      duration: 3000,
    });
  };

  const hasActiveFilters =
    search ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/products/checkout">
              <ShoppingCart className="mr-2 h-4 w-4" /> View Checkout Cart
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content - E-commerce Product Explorer Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filter Sidebar */}
        <aside className="w-full flex-shrink-0 lg:w-64 xl:w-72">
          <Card>
            <CardContent className="space-y-5 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-sm">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer text-muted-foreground text-xs underline hover:text-destructive"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <Separator />

              {/* Search */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Search</Label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name, SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 pl-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs">Category</Label>
                <div className="space-y-2">
                  {Object.keys(categoryCounts).map((cat) => (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        <Label htmlFor={`cat-${cat}`} className="cursor-pointer font-normal text-sm">
                          {cat}
                        </Label>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {categoryCounts[cat]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs">Stock Status</Label>
                <div className="space-y-2">
                  {Object.keys(statusCounts).map((status) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => toggleStatus(status)}
                        />
                        <Label htmlFor={`status-${status}`} className="cursor-pointer font-normal text-sm capitalize">
                          {status.replace("-", " ")}
                        </Label>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {statusCounts[status]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs">Price Range ($)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="h-9 text-center font-mono"
                  />
                  <span className="text-muted-foreground text-xs">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="h-9 text-center font-mono"
                  />
                </div>
              </div>

              <Separator />

              {/* Rating */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs">Minimum Rating</Label>
                <RadioGroup
                  value={String(minRating)}
                  onValueChange={(v) => setMinRating(parseFloat(v))}
                  className="space-y-2"
                >
                  {[0, 4.0, 4.5].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <RadioGroupItem value={String(rating)} id={`rating-${rating}`} />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="flex cursor-pointer items-center gap-1 font-normal text-sm"
                      >
                        {rating === 0 ? (
                          "All Ratings"
                        ) : (
                          <>
                            {rating.toFixed(1)}+
                            <span className="flex items-center gap-0.5">
                              {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </span>
                          </>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Product Grid/List */}
        <section className="min-w-0 flex-1 space-y-4">
          {/* Toolbar */}
          <Card className="p-2">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-0">
              <span className="text-muted-foreground text-sm">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of{" "}
                <span className="font-semibold text-foreground">{products.length}</span> products
              </span>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex rounded-md border p-0.5">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {selectedCategories.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1 pr-1">
                  {cat}
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedStatuses.map((status) => (
                <Badge key={status} variant="secondary" className="gap-1 pr-1 capitalize">
                  {status.replace("-", " ")}
                  <button
                    onClick={() => toggleStatus(status)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {minPrice !== "" && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Min ${minPrice}
                  <button onClick={() => setMinPrice("")} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {maxPrice !== "" && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Max ${maxPrice}
                  <button onClick={() => setMaxPrice("")} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {minRating.toFixed(1)}+ Rating
                  <button onClick={() => setMinRating(0)} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Search: {search}
                  <button onClick={() => setSearch("")} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <Package className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <h3 className="mb-1 font-medium text-lg">No products match your filters</h3>
              <p className="mb-4 max-w-sm text-muted-foreground text-sm">
                Try loosening your filters or clearing your search terms.
              </p>
              <Button onClick={clearFilters} variant="secondary" size="sm">
                Reset Filters
              </Button>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => {
                const discountRate =
                  p.compareAtPrice && p.compareAtPrice > p.price
                    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                    : 0;

                return (
                  <Card
                    key={p.id}
                    className="group flex flex-col overflow-hidden hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/40">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className={`${statusColors[p.status]} text-xs`}>{p.status.replace("-", " ")}</Badge>
                        {discountRate > 0 && (
                          <Badge className="border-none bg-red-500 text-white text-xs">-{discountRate}%</Badge>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 gap-1 border-none bg-zinc-900/80 text-white text-xs dark:bg-black/70"
                      >
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {p.rating.toFixed(1)}
                      </Badge>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" asChild>
                          <Link href="/dashboard/products/details">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => handleQuickAdd(p)}
                          disabled={p.status === "out-of-stock"}
                          className="h-9 w-9 rounded-full"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="flex flex-1 flex-col justify-between space-y-3 p-4">
                      <div>
                        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          {p.category}
                        </span>
                        <Link
                          href="/dashboard/products/details"
                          className="mt-0.5 line-clamp-1 block font-semibold text-sm leading-tight hover:text-primary"
                        >
                          {p.name}
                        </Link>
                        <span className="mt-0.5 block font-mono text-muted-foreground text-xs">SKU: {p.sku}</span>
                      </div>

                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-lg">
                            $
                            {p.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          {p.compareAtPrice && p.compareAtPrice > p.price && (
                            <span className="text-muted-foreground text-xs line-through">
                              $
                              {p.compareAtPrice.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAdd(p)}
                          disabled={p.status === "out-of-stock"}
                          className="h-8 gap-1 px-3 text-xs"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((p) => {
                const discountRate =
                  p.compareAtPrice && p.compareAtPrice > p.price
                    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                    : 0;

                return (
                  <Card
                    key={p.id}
                    className="group flex flex-col items-start gap-4 overflow-hidden p-4 hover:border-primary/40 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border bg-muted">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      {discountRate > 0 && (
                        <Badge className="absolute right-1 bottom-1 border-none bg-red-500 px-1 py-0 text-[10px] text-white">
                          -{discountRate}%
                        </Badge>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          {p.category}
                        </span>
                        <Badge className={`${statusColors[p.status]} text-xs`}>{p.status.replace("-", " ")}</Badge>
                      </div>
                      <Link
                        href="/dashboard/products/details"
                        className="mt-1 block truncate font-semibold text-base leading-snug hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-3 text-muted-foreground text-xs">
                        <span className="font-mono">SKU: {p.sku}</span>
                        <span className="flex items-center gap-0.5 font-semibold text-yellow-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {p.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-row items-center justify-between gap-3 border-t pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-none sm:pt-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-lg">
                          $
                          {p.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                          <span className="text-muted-foreground text-xs line-through">
                            $
                            {p.compareAtPrice.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" asChild>
                          <Link href="/dashboard/products/details">
                            <Eye className="h-3.5 w-3.5" /> View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuickAdd(p)}
                          disabled={p.status === "out-of-stock"}
                          className="h-8 gap-1 text-xs"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
