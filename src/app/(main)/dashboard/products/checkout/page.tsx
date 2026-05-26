"use client";

import { useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

type CartItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
};

const INITIAL_CART: CartItem[] = [
  {
    id: "prod-1",
    name: 'MacBook Pro 16"',
    sku: "MBP-16-2024",
    price: 2499.0,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&dpr=2&q=80",
    category: "Electronics",
  },
  {
    id: "prod-2",
    name: "iPhone 15 Pro Max",
    sku: "IP15-PM-256",
    price: 1199.0,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&dpr=2&q=80",
    category: "Electronics",
  },
  {
    id: "prod-10",
    name: "Wireless Mouse Pro",
    sku: "WMP-BLK-001",
    price: 79.0,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&h=150&dpr=2&q=80",
    category: "Electronics",
  },
];

const VALID_COUPONS: Record<string, { type: "discount" | "shipping"; value: number }> = {
  DISCOUNT10: { type: "discount", value: 10 },
  WELCOME20: { type: "discount", value: 20 },
  FREESHIP: { type: "shipping", value: 0 },
};

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [promoInput, setPromoInput] = useState<string>("");
  const [activeCoupon, setActiveCoupon] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [freeShipping, setFreeShipping] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>("");
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const [orderSummaryId] = useState<string>(() => `ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const shippingCost = subtotal > 0 && !freeShipping ? 15.0 : 0;
  const taxCost = (subtotal - discountAmount) * 0.08;
  const grandTotal = subtotal > 0 ? subtotal - discountAmount + shippingCost + taxCost : 0;

  const applyPromoCode = () => {
    setPromoError("");
    const cleanedCode = promoInput.trim().toUpperCase();

    if (!cleanedCode) {
      setPromoError("Please enter a code.");
      return;
    }

    const coupon = VALID_COUPONS[cleanedCode];
    if (coupon) {
      if (coupon.type === "discount") {
        setDiscountPercent(coupon.value);
      } else {
        setFreeShipping(true);
      }
      setActiveCoupon(cleanedCode);
      setPromoInput("");
    } else {
      setPromoError("Invalid coupon code.");
    }
  };

  const removePromoCode = () => {
    setActiveCoupon("");
    setDiscountPercent(0);
    setFreeShipping(false);
  };

  const validateBilling = () => {
    const errors: Record<string, string> = {};
    if (!billing.name.trim()) errors.name = "Full name is required.";
    if (!billing.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(billing.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!billing.phone.trim()) errors.phone = "Phone number is required.";
    if (!billing.address.trim()) errors.address = "Shipping address is required.";
    if (!billing.city.trim()) errors.city = "City is required.";
    if (!billing.state.trim()) errors.state = "State/Province is required.";
    if (!billing.zip.trim()) errors.zip = "Postal code is required.";

    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = () => {
    if (validateBilling()) {
      setCurrentStep(3);
    }
  };

  const validatePayment = () => {
    if (paymentMethod !== "credit_card") return true;

    const errors: Record<string, string> = {};
    if (!card.holder.trim()) errors.holder = "Cardholder name is required.";
    if (!card.number.trim()) {
      errors.number = "Card number is required.";
    } else if (card.number.replace(/\s/g, "").length < 16) {
      errors.number = "Card number must be 16 digits.";
    }
    if (!card.expiry.trim()) {
      errors.expiry = "Expiry date is required.";
    } else if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      errors.expiry = "Use MM/YY format.";
    }
    if (!card.cvv.trim()) {
      errors.cvv = "CVV code is required.";
    } else if (card.cvv.length < 3) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProcessOrder = async () => {
    if (!validatePayment()) return;

    setIsProcessingOrder(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessingOrder(false);
    setCurrentStep(4);
  };

  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    const formatted =
      digits
        .substring(0, 16)
        .match(/.{1,4}/g)
        ?.join(" ") || digits;
    setCard({ ...card, number: formatted });
  };

  const detectCardBrand = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "Amex";
    return null;
  };

  const steps = [
    { num: 1, title: "Cart", desc: "Review items" },
    { num: 2, title: "Shipping", desc: "Delivery address" },
    { num: 3, title: "Payment", desc: "Secure checkout" },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Checkout</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
      </div>

      {currentStep < 4 && (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.num} className="flex flex-1 items-center gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-xs ${
                    currentStep === step.num
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step.num
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.num ? "✓" : step.num}
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="font-medium text-sm leading-none">{step.title}</span>
                  <span className="text-muted-foreground text-xs">{step.desc}</span>
                </div>
              </div>
              {index < steps.length - 1 && <div className="mx-2 h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>Review items and adjust quantities before checkout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="mb-3 h-12 w-12 stroke-[1.5] text-muted-foreground/40" />
                    <h3 className="mb-1 font-medium text-lg">Your cart is empty</h3>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Add some items from our collection to complete a transaction.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/products">Return to Store</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y rounded-lg border">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-sm">{item.name}</h4>
                          <span className="font-mono text-muted-foreground text-xs">{item.sku}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center font-medium text-xs">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="w-20 text-right">
                            <span className="font-semibold text-sm">
                              ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard/products">Continue Shopping</Link>
                  </Button>
                  <Button onClick={() => setCurrentStep(2)} className="gap-1.5">
                    Proceed to Billing <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your delivery address details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!billingErrors.name} className="gap-1.5">
                    <FieldLabel>Full Name</FieldLabel>
                    <Input
                      placeholder="Alex Mercer"
                      value={billing.name}
                      onChange={(e) => {
                        setBilling({ ...billing, name: e.target.value });
                        if (billingErrors.name) setBillingErrors({ ...billingErrors, name: "" });
                      }}
                    />
                    {billingErrors.name && <FieldError errors={[{ message: billingErrors.name }]} />}
                  </Field>

                  <Field data-invalid={!!billingErrors.email} className="gap-1.5">
                    <FieldLabel>Email Address</FieldLabel>
                    <Input
                      type="email"
                      placeholder="alex@example.com"
                      value={billing.email}
                      onChange={(e) => {
                        setBilling({ ...billing, email: e.target.value });
                        if (billingErrors.email) setBillingErrors({ ...billingErrors, email: "" });
                      }}
                    />
                    {billingErrors.email && <FieldError errors={[{ message: billingErrors.email }]} />}
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field data-invalid={!!billingErrors.phone} className="gap-1.5">
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input
                      placeholder="+1 (555) 019-2834"
                      value={billing.phone}
                      onChange={(e) => {
                        setBilling({ ...billing, phone: e.target.value });
                        if (billingErrors.phone) setBillingErrors({ ...billingErrors, phone: "" });
                      }}
                    />
                    {billingErrors.phone && <FieldError errors={[{ message: billingErrors.phone }]} />}
                  </Field>

                  <Field data-invalid={!!billingErrors.address} className="gap-1.5">
                    <FieldLabel>Shipping Address</FieldLabel>
                    <Input
                      placeholder="Street name, suite, or apartment"
                      value={billing.address}
                      onChange={(e) => {
                        setBilling({ ...billing, address: e.target.value });
                        if (billingErrors.address) setBillingErrors({ ...billingErrors, address: "" });
                      }}
                    />
                    {billingErrors.address && <FieldError errors={[{ message: billingErrors.address }]} />}
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field data-invalid={!!billingErrors.city} className="gap-1.5">
                    <FieldLabel>City</FieldLabel>
                    <Input
                      placeholder="San Francisco"
                      value={billing.city}
                      onChange={(e) => {
                        setBilling({ ...billing, city: e.target.value });
                        if (billingErrors.city) setBillingErrors({ ...billingErrors, city: "" });
                      }}
                    />
                    {billingErrors.city && <FieldError errors={[{ message: billingErrors.city }]} />}
                  </Field>

                  <Field data-invalid={!!billingErrors.state} className="gap-1.5">
                    <FieldLabel>State / Province</FieldLabel>
                    <Input
                      placeholder="California"
                      value={billing.state}
                      onChange={(e) => {
                        setBilling({ ...billing, state: e.target.value });
                        if (billingErrors.state) setBillingErrors({ ...billingErrors, state: "" });
                      }}
                    />
                    {billingErrors.state && <FieldError errors={[{ message: billingErrors.state }]} />}
                  </Field>

                  <Field data-invalid={!!billingErrors.zip} className="gap-1.5">
                    <FieldLabel>ZIP / Postal Code</FieldLabel>
                    <Input
                      placeholder="94103"
                      value={billing.zip}
                      onChange={(e) => {
                        setBilling({ ...billing, zip: e.target.value });
                        if (billingErrors.zip) setBillingErrors({ ...billingErrors, zip: "" });
                      }}
                    />
                    {billingErrors.zip && <FieldError errors={[{ message: billingErrors.zip }]} />}
                  </Field>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back to Cart
                </Button>
                <Button onClick={handleNextToPayment} className="gap-1.5">
                  Proceed to Payment <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose a payment method to complete your order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-3">
                  <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="credit_card" className="sr-only" />
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium text-sm">Credit Card</span>
                  </label>
                  <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="paypal" className="sr-only" />
                    <span className="font-semibold text-sm italic">PayPal</span>
                  </label>
                  <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value="bank_transfer" className="sr-only" />
                    <span className="font-medium text-sm">Wire Transfer</span>
                  </label>
                </RadioGroup>

                {paymentMethod === "credit_card" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field data-invalid={!!cardErrors.holder} className="gap-1.5">
                        <FieldLabel>Cardholder Name</FieldLabel>
                        <Input
                          placeholder="ALEX MERCER"
                          value={card.holder}
                          onChange={(e) => {
                            setCard({ ...card, holder: e.target.value.toUpperCase() });
                            if (cardErrors.holder) setCardErrors({ ...cardErrors, holder: "" });
                          }}
                        />
                        {cardErrors.holder && <FieldError errors={[{ message: cardErrors.holder }]} />}
                      </Field>

                      <Field data-invalid={!!cardErrors.number} className="gap-1.5">
                        <FieldLabel>
                          <div className="flex items-center justify-between">
                            <span>Card Number</span>
                            {detectCardBrand(card.number) && (
                              <Badge variant="secondary" className="text-[10px]">
                                {detectCardBrand(card.number)}
                              </Badge>
                            )}
                          </div>
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            placeholder="0000 0000 0000 0000"
                            value={card.number}
                            onChange={(e) => {
                              handleCardNumberChange(e.target.value);
                              if (cardErrors.number) setCardErrors({ ...cardErrors, number: "" });
                            }}
                            className="pl-10"
                          />
                          <CreditCard className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground/60" />
                        </div>
                        {cardErrors.number && <FieldError errors={[{ message: cardErrors.number }]} />}
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field data-invalid={!!cardErrors.expiry} className="gap-1.5">
                        <FieldLabel>Expiration Date</FieldLabel>
                        <Input
                          placeholder="MM/YY"
                          maxLength={5}
                          value={card.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length > 2) {
                              val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                            }
                            setCard({ ...card, expiry: val });
                            if (cardErrors.expiry) setCardErrors({ ...cardErrors, expiry: "" });
                          }}
                        />
                        {cardErrors.expiry && <FieldError errors={[{ message: cardErrors.expiry }]} />}
                      </Field>

                      <Field data-invalid={!!cardErrors.cvv} className="gap-1.5">
                        <FieldLabel>
                          <div className="flex items-center gap-1">
                            <span>CVV Code</span>
                          </div>
                        </FieldLabel>
                        <Input
                          type="password"
                          placeholder="000"
                          maxLength={4}
                          value={card.cvv}
                          onChange={(e) => {
                            setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") });
                            if (cardErrors.cvv) setCardErrors({ ...cardErrors, cvv: "" });
                          }}
                        />
                        {cardErrors.cvv && <FieldError errors={[{ message: cardErrors.cvv }]} />}
                      </Field>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
                    <span className="font-bold text-blue-600 text-lg italic dark:text-blue-400">PayPal</span>
                    <p className="max-w-md text-muted-foreground text-sm">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                    <Badge variant="outline">Auto Redirect Enabled</Badge>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-3 rounded-lg border p-4">
                    <h4 className="font-semibold text-muted-foreground text-xs">Bank Transfer Details:</h4>
                    <pre className="rounded border bg-muted p-3 font-mono text-xs">
                      Bank Name: Apex Global Trust Ltd.{"\n"}
                      IBAN Code: US89 9002 1283 9128 3491{"\n"}
                      SWIFT/BIC: APEXTRUSTUS33{"\n"}
                      Reference: {orderSummaryId}
                    </pre>
                    <p className="text-muted-foreground text-xs">
                      Please include the Order reference ID in your wire transfer.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-lg border border-emerald-200/50 bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <div>
                    <span className="block font-semibold text-emerald-700 text-xs dark:text-emerald-400">
                      Secure SSL Checkout
                    </span>
                    <span className="text-muted-foreground text-xs">All transactions are encrypted and secure.</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isProcessingOrder}>
                  Back to Shipping
                </Button>
                <Button
                  onClick={handleProcessOrder}
                  disabled={isProcessingOrder || cart.length === 0}
                  className="min-w-[140px] gap-1.5"
                >
                  {isProcessingOrder ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Finalize Order <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="border-emerald-500/20">
              <CardContent className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
                <CheckCircle2 className="h-16 w-16 stroke-[1.5] text-emerald-500" />
                <div className="max-w-md space-y-2">
                  <h2 className="font-bold text-2xl tracking-tight">Order Confirmed!</h2>
                  <p className="text-muted-foreground text-sm">
                    Your payment has been processed successfully. Your order is being prepared.
                  </p>
                </div>

                <div className="w-full max-w-lg space-y-4 rounded-lg border p-5 text-left text-xs">
                  <div className="flex items-center justify-between border-b pb-3 font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span>Order Summary</span>
                    <span className="font-mono font-semibold text-foreground">{orderSummaryId}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="mb-0.5 block text-muted-foreground">Shipping To:</span>
                      <span className="block font-semibold">{billing.name}</span>
                      <span className="block text-muted-foreground/80 leading-tight">
                        {billing.address}, {billing.city}, {billing.state} {billing.zip}
                      </span>
                    </div>
                    <div>
                      <span className="mb-0.5 block text-muted-foreground">Payment:</span>
                      <span className="block font-semibold uppercase">{paymentMethod.replace("_", " ")}</span>
                      <span className="block font-medium text-emerald-500">✓ Paid</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <span className="block font-medium text-muted-foreground">Items:</span>
                    <div className="space-y-1.5">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-muted-foreground/90">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Total Charged:</span>
                    <span>${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/products">Return to Store</Link>
                  </Button>
                  <Button
                    onClick={() => {
                      setCart([]);
                      setCurrentStep(1);
                      setBilling({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });
                      setCard({ holder: "", number: "", expiry: "", cvv: "" });
                      setActiveCoupon("");
                      setDiscountPercent(0);
                      setFreeShipping(false);
                    }}
                  >
                    Start New Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {currentStep < 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Order Summary</span>
                  {cart.length > 0 && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground text-xs">No items in checkout cart.</div>
                ) : (
                  <div className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border bg-muted">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-xs">{item.name}</span>
                          <span className="block font-mono text-[10px] text-muted-foreground">
                            ${item.price.toLocaleString("en-US")} × {item.quantity}
                          </span>
                        </div>
                        <div className="text-right font-semibold text-xs">
                          ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-foreground">
                      ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between font-medium text-emerald-500">
                      <span className="flex items-center gap-1">
                        <Ticket className="h-3 w-3" /> Discount ({discountPercent}%):
                      </span>
                      <span>-${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Shipping:
                    </span>
                    <span className="font-semibold text-foreground">
                      {shippingCost === 0 ? (
                        <span className="font-medium text-emerald-500">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Sales Tax (8%):</span>
                    <span className="font-semibold text-foreground">
                      ${taxCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-sm">
                    <span>Grand Total:</span>
                    <span>${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="flex items-center gap-1 font-semibold text-muted-foreground text-xs">
                    <Tag className="h-3.5 w-3.5" /> Coupon Code
                  </label>

                  {activeCoupon ? (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-50/50 p-2 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-1.5">
                        <Ticket className="h-4 w-4 text-emerald-500" />
                        <span className="font-mono font-semibold text-emerald-600 text-xs dark:text-emerald-400">
                          {activeCoupon}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="cursor-pointer text-muted-foreground text-xs underline hover:text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. DISCOUNT10"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError("");
                        }}
                        className={`h-8 font-mono text-xs ${promoError ? "border-destructive" : ""}`}
                      />
                      <Button type="button" onClick={applyPromoCode} className="h-8 px-3 text-xs" variant="secondary">
                        Apply
                      </Button>
                    </div>
                  )}

                  {promoError && <p className="font-medium text-destructive text-xs">{promoError}</p>}

                  <div className="flex flex-col gap-1 rounded-lg border bg-muted/50 p-2">
                    <span className="block font-semibold text-[10px] text-muted-foreground uppercase">
                      Test Coupons:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPromoInput("DISCOUNT10");
                          setPromoError("");
                        }}
                        className="cursor-pointer rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] hover:bg-muted"
                      >
                        DISCOUNT10 (10% Off)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPromoInput("FREESHIP");
                          setPromoError("");
                        }}
                        className="cursor-pointer rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] hover:bg-muted"
                      >
                        FREESHIP (Free Shipping)
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
