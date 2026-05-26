"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const product = {
  id: "prod-1",
  name: 'MacBook Pro 16"',
  sku: "MBP-16-2024",
  category: "Electronics",
  price: 2499.0,
  originalPrice: 2799.0,
  stock: 45,
  status: "in-stock",
  rating: 4.8,
  reviewCount: 342,
  description:
    "The MacBook Pro 16-inch delivers groundbreaking performance with the M3 Max chip. Featuring a stunning Liquid Retina XDR display, up to 22 hours of battery life, and advanced thermal architecture for sustained performance.",
  features: [
    "Apple M3 Max chip with 16-core CPU",
    "40-core GPU for graphics-intensive workflows",
    "36GB unified memory for seamless multitasking",
    "1TB SSD storage",
    "16.2-inch Liquid Retina XDR display",
    "Up to 22 hours battery life",
    "1080p FaceTime HD camera",
    "Six-speaker sound system with Spatial Audio",
  ],
  specifications: {
    Processor: "Apple M3 Max",
    Memory: "36GB Unified",
    Storage: "1TB SSD",
    Display: '16.2" Liquid Retina XDR',
    Graphics: "40-core GPU",
    Battery: "Up to 22 hours",
    Weight: "4.7 lbs (2.14 kg)",
    Ports: "3x Thunderbolt 4, HDMI, SDXC, MagSafe",
  },
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&dpr=2&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&dpr=2&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&dpr=2&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=600&dpr=2&q=80",
  ],
  reviews: [
    {
      id: "rev-1",
      user: { name: "Alex Johnson", avatar: "https://github.com/shadcn.png" },
      rating: 5,
      date: "2024-01-20",
      comment:
        "Absolutely incredible machine. The M3 Max handles everything I throw at it with ease. Video editing is butter smooth.",
    },
    {
      id: "rev-2",
      user: { name: "Sarah Chen", avatar: "https://github.com/shadcn.png" },
      rating: 5,
      date: "2024-01-18",
      comment: "Best laptop I've ever owned. The display is stunning and battery life is phenomenal.",
    },
    {
      id: "rev-3",
      user: { name: "Michael Rodriguez", avatar: "https://github.com/shadcn.png" },
      rating: 4,
      date: "2024-01-15",
      comment: "Great performance but quite heavy for travel. Otherwise, it's a powerhouse.",
    },
  ],
  relatedProducts: [
    {
      id: "prod-2",
      name: "iPhone 15 Pro Max",
      price: 1199.0,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&dpr=2&q=80",
      rating: 4.9,
    },
    {
      id: "prod-9",
      name: '4K Monitor 32"',
      price: 699.0,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&dpr=2&q=80",
      rating: 4.7,
    },
    {
      id: "prod-7",
      name: "Mechanical Keyboard RGB",
      price: 179.0,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200&h=200&dpr=2&q=80",
      rating: 4.6,
    },
    {
      id: "prod-10",
      name: "Wireless Mouse Pro",
      price: 79.0,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&dpr=2&q=80",
      rating: 4.5,
    },
  ],
};

const statusColors = {
  "in-stock": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "low-stock": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "out-of-stock": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function ProductDetailsPage() {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi],
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Product Details</h1>
          <p className="text-muted-foreground text-sm">{format(new Date(), "EEEE, do MMMM yyyy")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex w-full flex-col gap-3">
          <Carousel setApi={setMainApi} className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square overflow-hidden rounded-xl border bg-card">
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-3 h-8 w-8 -translate-y-1/2 rounded-full"
              onClick={() => mainApi?.scrollPrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 rounded-full"
              onClick={() => mainApi?.scrollNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Carousel>

          <Carousel
            setApi={setThumbApi}
            opts={{
              containScroll: "keepSnaps",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 flex-row">
              {product.images.map((image, index) => (
                <CarouselItem key={index} className="basis-1/4 cursor-pointer pl-2" onClick={() => onThumbClick(index)}>
                  <div
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                      index === selectedIndex
                        ? "border-primary opacity-100"
                        : "border-transparent opacity-40 hover:opacity-70",
                    )}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                {product.status.replace("-", " ")}
              </Badge>
            </div>
            <h2 className="font-semibold text-2xl">{product.name}</h2>
            <p className="text-muted-foreground text-sm">SKU: {product.sku}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-bold text-3xl">
              ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-lg text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              Save ${(product.originalPrice - product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Badge>
          </div>

          <Separator />

          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </Button>
            </div>
            <span className="text-muted-foreground text-sm">{product.stock} available</span>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/50 p-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="features" className="mt-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 font-semibold text-lg">Key Features</h3>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4">
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="w-40 px-4 py-3 font-medium text-sm">{key}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <div className="flex flex-col gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{review.user.name}</p>
                      <p className="text-muted-foreground text-xs">{format(new Date(review.date), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-xl">Related Products</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.relatedProducts.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{item.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">
                    ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
