"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import { ActionButtons } from "./_components/action-buttons";
import { BrandSidebar } from "./_components/brand-sidebar";
import { CartTable } from "./_components/cart-table";
import { type Customer, CustomerSelector } from "./_components/customer-selector";
import { ModifiersSummary } from "./_components/modifiers-summary";
// Sub-components
import { PosHeader } from "./_components/pos-header";
import { ProductSearch } from "./_components/product-search";
import type { CartItem, Product } from "./_components/types";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Ergonomic Mouse",
    price: 49.99,
    category: "Electronics",
    brand: "Apple",
    sku: "EL-MOUSE-01",
    stock: 12,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "2",
    name: "Mechanical Keyboard RGB",
    price: 119.99,
    category: "Electronics",
    brand: "Apple",
    sku: "EL-KEYBD-02",
    stock: 5,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "3",
    name: 'UltraWide 4K Monitor 32"',
    price: 449.99,
    category: "Electronics",
    brand: "Apple",
    sku: "EL-MONTR-03",
    stock: 3,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "4",
    name: "Coca-Cola Can 330ml",
    price: 0.75,
    category: "Lifestyle",
    brand: "Coca-Cola",
    sku: "LF-COLA-04",
    stock: 120,
    color: "bg-red-500/10 text-red-500",
  },
  {
    id: "5",
    name: "Sprite Can 330ml",
    price: 0.75,
    category: "Lifestyle",
    brand: "Coca-Cola",
    sku: "LF-SPRITE-05",
    stock: 80,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "6",
    name: "Air Max 90",
    price: 130.0,
    category: "Apparel",
    brand: "Nike",
    sku: "AP-NIKE-06",
    stock: 8,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "7",
    name: "Dunk Low Retro",
    price: 115.0,
    category: "Apparel",
    brand: "Nike",
    sku: "AP-NIKE-07",
    stock: 4,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "8",
    name: "Premium Espresso Beans 1kg",
    price: 29.99,
    category: "Food & Beverage",
    brand: "Nestle",
    sku: "FB-NES-08",
    stock: 40,
    color: "bg-amber-500/10 text-amber-500",
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { value: "walk_in_customer", label: "Walk-In Customer" },
  { value: "sokha_chea", label: "Sokha Chea", phone: "012345678" },
  { value: "john_doe", label: "John Doe", phone: "011222333" },
];

export default function PosLayout() {
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customersList, setCustomersList] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Active Transaction States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState("walk_in_customer");

  // Modifiers
  const [exchangeRate, setExchangeRate] = useState(4100);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0); // percentage
  const [shipping, setShipping] = useState(0);

  // Derived Brands list
  const brands = useMemo(() => {
    return Array.from(new Set(productsList.map((p) => p.brand)));
  }, [productsList]);

  // Filtered products for listing
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [productsList, searchQuery, selectedBrand]);

  // Cart actions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.product.id === productId) {
              const nextQty = item.quantity + amount;
              return nextQty > 0 ? { ...item, quantity: nextQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearTransaction = () => {
    setCart([]);
    setDiscount(0);
    setTax(0);
    setShipping(0);
    setSelectedCustomer("walk_in_customer");
    setSearchQuery("");
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Modifiers impact
  const taxAmount = (subtotal - discount) * (tax / 100);
  const totalUsd = Math.max(0, subtotal - discount + taxAmount + shipping);
  const totalRiel = Math.round(totalUsd * exchangeRate);

  // Actions
  const handleRecentTransactions = () => {
    toast.info("Recent Transactions log opened");
  };

  const handleDraft = () => {
    toast.success("Order saved as Draft successfully!");
    clearTransaction();
  };

  const handleQuotation = () => {
    toast.success("Quotation generated successfully!");
    clearTransaction();
  };

  const handleSuspend = () => {
    toast.warning("Register transaction suspended!");
    clearTransaction();
  };

  const handleCreditSale = () => {
    toast.success(`Credit sale of $${totalUsd.toFixed(2)} processed!`);
    clearTransaction();
  };

  const handleCardPayment = () => {
    toast.success(`Card payment of $${totalUsd.toFixed(2)} (៛${totalRiel.toLocaleString()}) completed!`);
    clearTransaction();
  };

  const handleMultiplePay = () => {
    toast.info("Split payment gateway initiated.");
  };

  const handleCashPayment = () => {
    toast.success(`Cash payment of $${totalUsd.toFixed(2)} (៛${totalRiel.toLocaleString()}) completed!`);
    clearTransaction();
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-muted/30 text-foreground">
      {/* Top POS Navigation Header */}
      <PosHeader onRecentTransactionsClick={handleRecentTransactions} />

      {/* Main Workspace */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Side: Register Checkout Pane */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
          {/* Top Panel Controls */}
          <div className="grid shrink-0 grid-cols-1 items-center gap-4 rounded border bg-background p-4 md:grid-cols-2">
            <CustomerSelector
              selectedCustomer={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
              customersList={customersList}
              onAddCustomer={(newCustomer) => setCustomersList((prev) => [...prev, newCustomer])}
            />

            <ProductSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddProduct={(newProduct) => setProductsList((prev) => [newProduct, ...prev])}
            />
          </div>

          {/* Cart Table list */}
          <CartTable
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            exchangeRate={exchangeRate}
          />

          {/* Modifiers & Summary */}
          <ModifiersSummary
            itemsCount={itemsCount}
            exchangeRate={exchangeRate}
            onExchangeRateChange={setExchangeRate}
            discount={discount}
            onDiscountChange={setDiscount}
            tax={tax}
            onTaxChange={setTax}
            shipping={shipping}
            onShippingChange={setShipping}
            totalUsd={totalUsd}
            totalRiel={totalRiel}
          />
        </div>

        {/* Right Side: Brands Catalog Drawer */}
        <BrandSidebar
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandSelect={setSelectedBrand}
          products={filteredProducts}
          cart={cart}
          onProductClick={addToCart}
          statusText="No Products to display"
        />
      </div>

      {/* Bottom Footer Actions Panel */}
      <ActionButtons
        totalPayableUsd={totalUsd}
        totalPayableRiel={totalRiel}
        onDraft={handleDraft}
        onQuotation={handleQuotation}
        onSuspend={handleSuspend}
        onCreditSale={handleCreditSale}
        onCard={handleCardPayment}
        onMultiplePay={handleMultiplePay}
        onCash={handleCashPayment}
        onCancel={clearTransaction}
        isCartEmpty={cart.length === 0}
      />
    </div>
  );
}
