"use client";

import { useMemo, useState } from "react";

import {
  CreditCard,
  HelpCircle,
  Info,
  Mail,
  MessageCircle,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const faqCategories = [
  {
    id: "general",
    name: "General",
    icon: Info,
    questions: [
      {
        question: "What is Rhea Admin?",
        answer:
          "Rhea Admin is a modern, open-source dashboard starter template built with Next.js 16, Tailwind CSS v4, and shadcn/ui. It provides a comprehensive set of components and pages to kickstart your admin panel or SaaS application.",
      },
      {
        question: "Is there a free trial available?",
        answer:
          "Yes! All paid plans come with a 14-day free trial. No credit card required to get started. You can explore all features during the trial period.",
      },
      {
        question: "Can I cancel my subscription at any time?",
        answer:
          "Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. There are no cancellation fees.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for all plans. If you're not satisfied with our service, contact our support team within 30 days of your purchase for a full refund.",
      },
    ],
  },
  {
    id: "billing",
    name: "Billing & Payments",
    icon: CreditCard,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual enterprise plans. All payments are processed securely through Stripe.",
      },
      {
        question: "Can I switch between monthly and yearly billing?",
        answer:
          "Yes, you can switch between monthly and yearly billing at any time. When switching to yearly billing, you'll receive a prorated credit for your remaining monthly period.",
      },
      {
        question: "How do I update my payment information?",
        answer:
          "You can update your payment information by going to Settings > Billing > Payment Methods. Click 'Update' next to your current payment method and enter the new details.",
      },
      {
        question: "Will I receive an invoice for my payments?",
        answer:
          "Yes, an invoice is automatically generated and sent to your registered email after each successful payment. You can also download invoices from your Billing dashboard.",
      },
    ],
  },
  {
    id: "features",
    name: "Features & Usage",
    icon: Settings,
    questions: [
      {
        question: "How many projects can I create?",
        answer:
          "The number of projects depends on your plan. The Starter plan allows up to 5 projects, while Professional and Enterprise plans offer unlimited projects.",
      },
      {
        question: "Can I invite team members to my account?",
        answer:
          "Yes, team collaboration is available on Professional and Enterprise plans. You can invite team members via email and assign them different roles and permissions.",
      },
      {
        question: "Is there an API available?",
        answer:
          "Yes, we provide a comprehensive REST API on all plans. API documentation is available in our developer portal, and you can generate API keys from your account settings.",
      },
      {
        question: "Do you offer integrations with third-party tools?",
        answer:
          "Yes, we offer native integrations with popular tools like Slack, Zapier, GitHub, Stripe, and more. Visit our Integrations page to see the full list and connect your favorite tools.",
      },
    ],
  },
  {
    id: "security",
    name: "Security & Privacy",
    icon: ShieldCheck,
    questions: [
      {
        question: "How is my data protected?",
        answer:
          "We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Our infrastructure is hosted on SOC 2 Type II compliant data centers with regular security audits.",
      },
      {
        question: "Do you support two-factor authentication?",
        answer:
          "Yes, we support two-factor authentication (2FA) using TOTP-based authenticator apps like Google Authenticator, Authy, or 1Password. We recommend enabling 2FA for all team members.",
      },
      {
        question: "Can I export my data?",
        answer:
          "Yes, you can export all your data at any time in standard formats (CSV, JSON, PDF). Go to Settings > Data Management > Export to initiate a data export.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "Data is stored in secure cloud infrastructure with regions available in the US, EU, and Asia-Pacific. Enterprise customers can choose their preferred data residency region.",
      },
    ],
  },
  {
    id: "support",
    name: "Support",
    icon: HelpCircle,
    questions: [
      {
        question: "How can I contact support?",
        answer:
          "You can reach our support team via email at support@studioadmin.com, through the in-app chat widget, or by submitting a support ticket from your dashboard. Enterprise customers also have access to a dedicated account manager.",
      },
      {
        question: "What are your support hours?",
        answer:
          "Standard support is available Monday-Friday, 9 AM - 6 PM EST. Enterprise customers receive 24/7 priority support with guaranteed response times under 1 hour.",
      },
      {
        question: "Do you offer onboarding assistance?",
        answer:
          "Yes, all plans include access to our documentation, video tutorials, and community forum. Professional and Enterprise plans also include a dedicated onboarding session with our team.",
      },
    ],
  },
];

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "support@studioadmin.com",
    action: "Send email",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Available 24/7",
    action: "Start chat",
  },
  {
    icon: Send,
    title: "Submit a Ticket",
    description: "Get a response within 24h",
    action: "Create ticket",
  },
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "up" | "down" | null>>({});

  const filteredCategories = useMemo(() => {
    return faqCategories
      .filter((category) => activeTab === "all" || category.id === activeTab)
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            searchQuery === "" ||
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchQuery, activeTab]);

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  const handleVote = (faqId: string, vote: "up" | "down") => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [faqId]: prev[faqId] === vote ? null : vote,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 py-8">
        <h1 className="text-center font-medium text-4xl tracking-[-0.04em]">Frequently Asked Questions</h1>
        <p className="text-center text-muted-foreground text-xl -tracking-[0.01em]">
          Find answers to common questions about our platform
        </p>

        <div className="relative mt-4 w-full max-w-md">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pr-9 pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute top-2.5 right-2.5 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto" variant="line">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-1.5">
                {faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0)}
              </Badge>
            </TabsTrigger>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id}>
                  <Icon className="hidden sm:block" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1.5">
                    {category.questions.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {totalResults === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>No results found</EmptyTitle>
                  <EmptyDescription>
                    No questions match &ldquo;{searchQuery}&rdquo;. Try a different search term or browse all
                    categories.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-8">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id}>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="font-medium text-lg">{category.name}</h2>
                        <Badge variant="outline">{category.questions.length}</Badge>
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, index) => {
                          const faqId = `${category.id}-${index}`;
                          return (
                            <AccordionItem key={faqId} value={faqId}>
                              <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                <div className="mt-3 flex items-center gap-2">
                                  <span className="text-muted-foreground text-xs">Was this helpful?</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 gap-1 px-2 ${helpfulVotes[faqId] === "up" ? "text-primary" : ""}`}
                                    onClick={() => handleVote(faqId, "up")}
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    Yes
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 gap-1 px-2 ${helpfulVotes[faqId] === "down" ? "text-destructive" : ""}`}
                                    onClick={() => handleVote(faqId, "down")}
                                  >
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                    No
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Card className="mx-auto mt-8 max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{method.title}</p>
                  <p className="text-muted-foreground text-xs">{method.description}</p>
                  <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs">
                    {method.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
