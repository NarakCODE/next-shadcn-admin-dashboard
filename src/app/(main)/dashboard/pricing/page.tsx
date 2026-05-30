"use client";

import { useState } from "react";

import { Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and small projects getting started.",
    monthlyPrice: 9,
    yearlyPrice: 7,
    features: [
      "Up to 5 projects",
      "10 GB storage",
      "Basic analytics",
      "Email support",
      "API access",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    description: "Ideal for growing teams and businesses that need more power.",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      "Unlimited projects",
      "100 GB storage",
      "Advanced analytics",
      "Priority support",
      "Full API access",
      "Custom integrations",
      "Team collaboration",
      "SSO authentication",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced security and compliance needs.",
    monthlyPrice: 79,
    yearlyPrice: 66,
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Custom analytics",
      "24/7 dedicated support",
      "SLA guarantee",
      "Advanced security",
      "Audit logs",
      "Custom contracts",
      "On-premise option",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "You can cancel anytime. Your access continues until the end of your billing period. No cancellation fees.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 py-8">
        <h1 className="text-center font-medium text-4xl tracking-[-0.04em]">Simple, transparent pricing</h1>
        <p className="text-center text-muted-foreground text-xl -tracking-[0.01em]">
          Choose the plan that works for you. All plans include a 14-day free trial.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className={`text-sm ${!isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm ${isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            Yearly
          </span>
          <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Save 20%
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg dark:border-primary" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-5xl">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {isYearly && <p className="mt-1 text-muted-foreground text-sm">Billed ${plan.yearlyPrice * 12}/year</p>}
              <Separator className="my-6" />
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <h2 className="mb-6 text-center font-medium text-2xl">Frequently asked questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="text-base">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
