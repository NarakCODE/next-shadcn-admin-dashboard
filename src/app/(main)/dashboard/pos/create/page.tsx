"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, ArrowRight, CheckIcon, LoaderCircleIcon } from "lucide-react";
import { Controller, type FieldErrors, type FieldPath, useForm } from "react-hook-form";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type POSFormValues = {
  pos_name: string;
  business_location: string;
  register_name: string;
  cashier_user: string;
  opening_cash_amount: number;
  current_datetime: string;

  primary_currency: "USD" | "KHR";
  secondary_currency: "KHR" | "USD";
  exchange_rate: number;
  show_totals_both_currencies: boolean;
  allow_manual_exchange_rate_override: boolean;

  customer: string;
  enable_add_customer: boolean;
  product_search_mode: "Product name" | "SKU" | "Barcode scanner" | "All";
  enable_browse_products: boolean;
  enable_add_product: boolean;
  default_product_panel: "Brands" | "Categories" | "Recent Products" | "Favorites";

  enable_discount: boolean;
  default_discount_amount: number;
  enable_order_tax: boolean;
  default_order_tax: number;
  enable_shipping: boolean;
  default_shipping_amount: number;
  allow_cashier_edit_modifiers: boolean;

  enable_cash: boolean;
  enable_card: boolean;
  enable_multiple_pay: boolean;
  enable_credit_sale: boolean;
  enable_draft: boolean;
  enable_quotation: boolean;
  enable_suspend_sale: boolean;
  enable_recent_transactions: boolean;
  default_payment_method: "Cash" | "Card" | "Multiple Pay" | "Credit Sale";

  setup_notes: string;
};

type Step = {
  id: number;
  title: string;
  description: string;
  fields: FieldPath<POSFormValues>[];
};

const steps: Step[] = [
  {
    id: 1,
    title: "Register details",
    description: "Name this register and assign where it will be used.",
    fields: [
      "pos_name",
      "business_location",
      "register_name",
      "cashier_user",
      "opening_cash_amount",
      "current_datetime",
    ],
  },
  {
    id: 2,
    title: "Currency",
    description: "Choose how prices and totals are displayed.",
    fields: ["primary_currency", "exchange_rate"],
  },
  {
    id: 3,
    title: "Selling preferences",
    description: "Set customer and product defaults for faster checkout.",
    fields: ["customer", "product_search_mode"],
  },
  {
    id: 4,
    title: "Order options",
    description: "Choose the adjustments available during a sale.",
    fields: [],
  },
  {
    id: 5,
    title: "Payments",
    description: "Select the payment actions shown at checkout.",
    fields: ["default_payment_method"],
  },
  {
    id: 6,
    title: "Review",
    description: "Confirm the essentials before creating your register.",
    fields: [],
  },
];

const defaultValues: POSFormValues = {
  pos_name: "Main POS",
  business_location: "ACLEDA BANK",
  register_name: "Register 01",
  cashier_user: "cashier_1",
  opening_cash_amount: 0,
  current_datetime: "2026-06-06T12:47",

  primary_currency: "USD",
  secondary_currency: "KHR",
  exchange_rate: 4100,
  show_totals_both_currencies: true,
  allow_manual_exchange_rate_override: true,

  customer: "walk_in_customer",
  enable_add_customer: true,
  product_search_mode: "All",
  enable_browse_products: true,
  enable_add_product: true,
  default_product_panel: "Brands",

  enable_discount: true,
  default_discount_amount: 0,
  enable_order_tax: true,
  default_order_tax: 0,
  enable_shipping: true,
  default_shipping_amount: 0,
  allow_cashier_edit_modifiers: true,

  enable_cash: true,
  enable_card: true,
  enable_multiple_pay: true,
  enable_credit_sale: true,
  enable_draft: true,
  enable_quotation: true,
  enable_suspend_sale: true,
  enable_recent_transactions: true,
  default_payment_method: "Cash",

  setup_notes: "",
};

const businessLocations = ["ACLEDA BANK", "Head Office", "Siem Reap Branch", "Battambang Branch"];
const cashiers = [
  { label: "Sokha Cashier", value: "cashier_1" },
  { label: "Dara Cashier", value: "cashier_2" },
  { label: "Admin User", value: "admin_user" },
];
const customers = [{ label: "Walk-In Customer", value: "walk_in_customer" }];

export default function POSCreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [created, setCreated] = React.useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<POSFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const values = watch();
  const activeStep = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const goNext = async () => {
    const isValid = activeStep.fields.length ? await trigger(activeStep.fields) : true;

    if (!isValid) return;

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const onSubmit = (data: POSFormValues) => {
    console.log("POS onboarding configuration:", data);
    setCreated(true);
    setSuccessDialogOpen(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6 pb-8">
      <div className="space-y-5">
        <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
          <Link href="/dashboard/pos">
            <ArrowLeft className="size-4" />
            POS registers
          </Link>
        </Button>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">Set up your POS</h1>
            {created && <Badge>Created</Badge>}
          </div>
          <p className="max-w-xl text-muted-foreground text-sm sm:text-base">
            A few quick choices will prepare this register for its first sale.
          </p>
        </div>
      </div>

      <Stepper
        value={currentStep + 1}
        onValueChange={(val) => setCurrentStep(val - 1)}
        className="w-full space-y-5"
        indicators={{
          completed: <CheckIcon className="size-3.5" />,
          loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />

          <StepperNav className="group/stepper-nav grid w-full grid-cols-6 gap-1 sm:gap-2">
            {steps.map((step, index) => (
              <StepperItem key={step.id} step={index + 1} className="min-w-0">
                <StepperTrigger
                  disabled={index > currentStep}
                  className="flex w-full min-w-0 flex-col items-center gap-1.5 rounded-md px-1 py-2 text-center disabled:cursor-default disabled:opacity-50"
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  <StepperIndicator>{index + 1}</StepperIndicator>
                  <StepperTitle className="hidden max-w-full truncate font-normal text-xs sm:block">
                    {step.title}
                  </StepperTitle>
                </StepperTrigger>
              </StepperItem>
            ))}
          </StepperNav>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <h2 className="font-semibold text-xl">{steps[currentStep].title}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <StepperPanel className="text-sm">
              <StepperContent value={1}>
                <BusinessLocationStep control={control} register={register} errors={errors} />
              </StepperContent>

              <StepperContent value={2}>
                <CurrencyStep control={control} register={register} errors={errors} values={values} />
              </StepperContent>

              <StepperContent value={3}>
                <CustomerProductStep control={control} errors={errors} values={values} />
              </StepperContent>

              <StepperContent value={4}>
                <TaxDiscountShippingStep control={control} register={register} values={values} />
              </StepperContent>

              <StepperContent value={5}>
                <PaymentMethodsStep control={control} errors={errors} values={values} />
              </StepperContent>

              <StepperContent value={6}>
                <ReviewStep values={values} register={register} />
              </StepperContent>
            </StepperPanel>
          </CardContent>
        </Card>

        <div className="flex w-full items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={goPrevious} disabled={currentStep === 0} className="-ml-3">
            <ArrowLeft className="size-4" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit">
              Create POS
              <CheckIcon className="size-4" />
            </Button>
          )}
        </div>
      </Stepper>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckIcon className="size-4" />
              </span>
              POS register created
            </DialogTitle>
            <DialogDescription>
              Your POS register is ready to use. You can now start processing sales.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={() => router.push("/pos")}>
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}) {
  return (
    <Field
      orientation="horizontal"
      className="items-center justify-between gap-4 rounded-lg border bg-background p-3.5"
    >
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={id} className="cursor-pointer font-medium text-sm">
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
  );
}

function SelectField<T extends string>({
  value,
  onValueChange,
  placeholder,
  items,
  id,
}: {
  value: T;
  onValueChange: (value: T) => void;
  placeholder: string;
  items: { label: string; value: T }[];
  id?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function BusinessLocationStep({
  control,
  register,
  errors,
}: {
  control: ReturnType<typeof useForm<POSFormValues>>["control"];
  register: ReturnType<typeof useForm<POSFormValues>>["register"];
  errors: FieldErrors<POSFormValues>;
}) {
  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      <Field data-invalid={!!errors.pos_name}>
        <FieldLabel htmlFor="pos_name">
          POS Name
          <span className="ml-1 text-destructive">*</span>
        </FieldLabel>
        <Input
          id="pos_name"
          placeholder="Main POS"
          aria-invalid={!!errors.pos_name}
          {...register("pos_name", { required: "POS name is required." })}
        />
        <FieldError errors={[errors.pos_name]} />
      </Field>

      <Controller
        control={control}
        name="business_location"
        rules={{ required: "Business location is required." }}
        render={({ field }) => (
          <Field data-invalid={!!errors.business_location}>
            <FieldLabel htmlFor="business_location">
              Business Location
              <span className="ml-1 text-destructive">*</span>
            </FieldLabel>
            <SelectField
              id="business_location"
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select location"
              items={businessLocations.map((location) => ({
                label: location,
                value: location,
              }))}
            />
            <FieldError errors={[errors.business_location]} />
          </Field>
        )}
      />

      <Field data-invalid={!!errors.register_name}>
        <FieldLabel htmlFor="register_name">
          Register Name
          <span className="ml-1 text-destructive">*</span>
        </FieldLabel>
        <Input
          id="register_name"
          placeholder="Register 01"
          aria-invalid={!!errors.register_name}
          {...register("register_name", {
            required: "Register name is required.",
          })}
        />
        <FieldError errors={[errors.register_name]} />
      </Field>

      <Controller
        control={control}
        name="cashier_user"
        rules={{ required: "Cashier/user is required." }}
        render={({ field }) => (
          <Field data-invalid={!!errors.cashier_user}>
            <FieldLabel htmlFor="cashier_user">
              Cashier/User
              <span className="ml-1 text-destructive">*</span>
            </FieldLabel>
            <SelectField
              id="cashier_user"
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select cashier"
              items={cashiers}
            />
            <FieldError errors={[errors.cashier_user]} />
          </Field>
        )}
      />

      <Field data-invalid={!!errors.opening_cash_amount}>
        <FieldLabel htmlFor="opening_cash_amount">
          Opening Cash Amount
          <span className="ml-1 text-destructive">*</span>
        </FieldLabel>
        <Input
          id="opening_cash_amount"
          type="number"
          min={0}
          step="0.01"
          aria-invalid={!!errors.opening_cash_amount}
          {...register("opening_cash_amount", {
            required: "Opening cash amount is required.",
            valueAsNumber: true,
            min: { value: 0, message: "Opening cash cannot be negative." },
          })}
        />
        <FieldError errors={[errors.opening_cash_amount]} />
      </Field>

      <Field data-invalid={!!errors.current_datetime}>
        <FieldLabel htmlFor="current_datetime">
          Current Date & Time
          <span className="ml-1 text-destructive">*</span>
        </FieldLabel>
        <Input
          id="current_datetime"
          type="datetime-local"
          aria-invalid={!!errors.current_datetime}
          {...register("current_datetime", {
            required: "Current date and time is required.",
          })}
        />
        <FieldError errors={[errors.current_datetime]} />
      </Field>
    </FieldGroup>
  );
}

function CurrencyStep({
  control,
  register,
  errors,
  values,
}: {
  control: ReturnType<typeof useForm<POSFormValues>>["control"];
  register: ReturnType<typeof useForm<POSFormValues>>["register"];
  errors: FieldErrors<POSFormValues>;
  values: POSFormValues;
}) {
  return (
    <FieldGroup className="gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="primary_currency"
          rules={{ required: "Primary currency is required." }}
          render={({ field }) => (
            <Field data-invalid={!!errors.primary_currency}>
              <FieldLabel htmlFor="primary_currency">
                Primary Currency
                <span className="ml-1 text-destructive">*</span>
              </FieldLabel>
              <SelectField
                id="primary_currency"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select primary currency"
                items={[
                  { label: "USD", value: "USD" },
                  { label: "KHR", value: "KHR" },
                ]}
              />
              <FieldError errors={[errors.primary_currency]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="secondary_currency"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="secondary_currency">Secondary Currency</FieldLabel>
              <SelectField
                id="secondary_currency"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select secondary currency"
                items={[
                  { label: "KHR", value: "KHR" },
                  { label: "USD", value: "USD" },
                ]}
              />
            </Field>
          )}
        />

        <Field data-invalid={!!errors.exchange_rate}>
          <FieldLabel htmlFor="exchange_rate">
            Exchange Rate
            <span className="ml-1 text-destructive">*</span>
          </FieldLabel>
          <Input
            id="exchange_rate"
            type="number"
            min={1}
            step="0.01"
            aria-invalid={!!errors.exchange_rate}
            {...register("exchange_rate", {
              required: "Exchange rate is required.",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Exchange rate must be greater than 0.",
              },
            })}
          />
          <FieldError errors={[errors.exchange_rate]} />
        </Field>
      </div>

      <FieldSet>
        <FieldLegend variant="label">Display & Override Options</FieldLegend>
        <FieldGroup className="gap-3">
          <Controller
            control={control}
            name="show_totals_both_currencies"
            render={({ field }) => (
              <ToggleRow
                id="show_totals_both_currencies"
                label="Show totals in both currencies"
                description="Display USD and KHR totals together in the POS summary."
                checked={values.show_totals_both_currencies}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="allow_manual_exchange_rate_override"
            render={({ field }) => (
              <ToggleRow
                id="allow_manual_exchange_rate_override"
                label="Allow manual exchange rate override"
                description="Cashiers can update exchange rate during checkout when needed."
                checked={values.allow_manual_exchange_rate_override}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function CustomerProductStep({
  control,
  errors,
  values,
}: {
  control: ReturnType<typeof useForm<POSFormValues>>["control"];
  errors: FieldErrors<POSFormValues>;
  values: POSFormValues;
}) {
  return (
    <FieldGroup className="gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="customer"
          rules={{ required: "Default customer is required." }}
          render={({ field }) => (
            <Field data-invalid={!!errors.customer}>
              <FieldLabel htmlFor="customer">
                Default Customer
                <span className="ml-1 text-destructive">*</span>
              </FieldLabel>
              <SelectField
                id="customer"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Search customer"
                items={customers}
              />
              <FieldDescription>Search-style default customer selector.</FieldDescription>
              <FieldError errors={[errors.customer]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="product_search_mode"
          rules={{ required: "Product search mode is required." }}
          render={({ field }) => (
            <Field data-invalid={!!errors.product_search_mode}>
              <FieldLabel htmlFor="product_search_mode">
                Product Search Mode
                <span className="ml-1 text-destructive">*</span>
              </FieldLabel>
              <SelectField
                id="product_search_mode"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select search mode"
                items={[
                  { label: "Product name", value: "Product name" },
                  { label: "SKU", value: "SKU" },
                  { label: "Barcode scanner", value: "Barcode scanner" },
                  { label: "All", value: "All" },
                ]}
              />
              <FieldError errors={[errors.product_search_mode]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="default_product_panel"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="default_product_panel">Default Product Panel</FieldLabel>
              <SelectField
                id="default_product_panel"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select panel"
                items={[
                  { label: "Brands", value: "Brands" },
                  { label: "Categories", value: "Categories" },
                  { label: "Recent Products", value: "Recent Products" },
                  { label: "Favorites", value: "Favorites" },
                ]}
              />
            </Field>
          )}
        />
      </div>

      <FieldSet>
        <FieldLegend variant="label">Customer & Product Buttons</FieldLegend>
        <FieldGroup className="gap-3">
          <Controller
            control={control}
            name="enable_add_customer"
            render={({ field }) => (
              <ToggleRow
                id="enable_add_customer"
                label="Enable add new customer button"
                checked={values.enable_add_customer}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="enable_browse_products"
            render={({ field }) => (
              <ToggleRow
                id="enable_browse_products"
                label="Enable browse products button"
                checked={values.enable_browse_products}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="enable_add_product"
            render={({ field }) => (
              <ToggleRow
                id="enable_add_product"
                label="Enable add new product button"
                checked={values.enable_add_product}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function TaxDiscountShippingStep({
  control,
  register,
  values,
}: {
  control: ReturnType<typeof useForm<POSFormValues>>["control"];
  register: ReturnType<typeof useForm<POSFormValues>>["register"];
  values: POSFormValues;
}) {
  return (
    <FieldGroup className="gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Field data-disabled={!values.enable_discount}>
          <FieldLabel htmlFor="default_discount_amount">Default Discount Amount</FieldLabel>
          <Input
            id="default_discount_amount"
            type="number"
            min={0}
            step="0.01"
            disabled={!values.enable_discount}
            {...register("default_discount_amount", { valueAsNumber: true })}
          />
        </Field>

        <Field data-disabled={!values.enable_order_tax}>
          <FieldLabel htmlFor="default_order_tax">Default Order Tax</FieldLabel>
          <Input
            id="default_order_tax"
            type="number"
            min={0}
            step="0.01"
            disabled={!values.enable_order_tax}
            {...register("default_order_tax", { valueAsNumber: true })}
          />
        </Field>

        <Field data-disabled={!values.enable_shipping}>
          <FieldLabel htmlFor="default_shipping_amount">Default Shipping Amount</FieldLabel>
          <Input
            id="default_shipping_amount"
            type="number"
            min={0}
            step="0.01"
            disabled={!values.enable_shipping}
            {...register("default_shipping_amount", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <FieldSet>
        <FieldLegend variant="label">Modifiers & Permissions</FieldLegend>
        <FieldGroup className="gap-3">
          <Controller
            control={control}
            name="enable_discount"
            render={({ field }) => (
              <ToggleRow
                id="enable_discount"
                label="Enable Discount"
                checked={values.enable_discount}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="enable_order_tax"
            render={({ field }) => (
              <ToggleRow
                id="enable_order_tax"
                label="Enable Order Tax"
                checked={values.enable_order_tax}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="enable_shipping"
            render={({ field }) => (
              <ToggleRow
                id="enable_shipping"
                label="Enable Shipping"
                checked={values.enable_shipping}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="allow_cashier_edit_modifiers"
            render={({ field }) => (
              <ToggleRow
                id="allow_cashier_edit_modifiers"
                label="Allow cashier to edit discount/tax/shipping"
                description="Cashiers can adjust modifiers before payment."
                checked={values.allow_cashier_edit_modifiers}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function PaymentMethodsStep({
  control,
  errors,
  values,
}: {
  control: ReturnType<typeof useForm<POSFormValues>>["control"];
  errors: FieldErrors<POSFormValues>;
  values: POSFormValues;
}) {
  const paymentToggles: {
    id: string;
    name: FieldPath<POSFormValues>;
    label: string;
    checked: boolean;
  }[] = [
    {
      id: "enable_cash",
      name: "enable_cash",
      label: "Enable Cash",
      checked: values.enable_cash,
    },
    {
      id: "enable_card",
      name: "enable_card",
      label: "Enable Card",
      checked: values.enable_card,
    },
    {
      id: "enable_multiple_pay",
      name: "enable_multiple_pay",
      label: "Enable Multiple Pay",
      checked: values.enable_multiple_pay,
    },
    {
      id: "enable_credit_sale",
      name: "enable_credit_sale",
      label: "Enable Credit Sale",
      checked: values.enable_credit_sale,
    },
    {
      id: "enable_draft",
      name: "enable_draft",
      label: "Enable Draft",
      checked: values.enable_draft,
    },
    {
      id: "enable_quotation",
      name: "enable_quotation",
      label: "Enable Quotation",
      checked: values.enable_quotation,
    },
    {
      id: "enable_suspend_sale",
      name: "enable_suspend_sale",
      label: "Enable Suspend Sale",
      checked: values.enable_suspend_sale,
    },
    {
      id: "enable_recent_transactions",
      name: "enable_recent_transactions",
      label: "Enable Recent Transactions",
      checked: values.enable_recent_transactions,
    },
  ];

  return (
    <FieldGroup className="gap-5">
      <Controller
        control={control}
        name="default_payment_method"
        rules={{ required: "Default payment method is required." }}
        render={({ field }) => (
          <Field data-invalid={!!errors.default_payment_method}>
            <FieldLabel htmlFor="default_payment_method">
              Default Payment Method
              <span className="ml-1 text-destructive">*</span>
            </FieldLabel>
            <SelectField
              id="default_payment_method"
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select default payment"
              items={[
                { label: "Cash", value: "Cash" },
                { label: "Card", value: "Card" },
                { label: "Multiple Pay", value: "Multiple Pay" },
                { label: "Credit Sale", value: "Credit Sale" },
              ]}
            />
            <FieldError errors={[errors.default_payment_method]} />
          </Field>
        )}
      />

      <FieldSet>
        <FieldLegend variant="label">Enabled Payment Methods</FieldLegend>
        <FieldGroup className="grid gap-3 md:grid-cols-2">
          {paymentToggles.map((item) => (
            <Controller
              key={item.name}
              control={control}
              name={item.name}
              render={({ field }) => (
                <ToggleRow id={item.id} label={item.label} checked={item.checked} onCheckedChange={field.onChange} />
              )}
            />
          ))}
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function ReviewStep({
  values,
  register,
}: {
  values: POSFormValues;
  register: ReturnType<typeof useForm<POSFormValues>>["register"];
}) {
  return (
    <FieldGroup className="gap-5">
      <Card className="bg-muted/30">
        <CardContent className="grid gap-3 p-4">
          <SummaryRow label="POS Name" value={values.pos_name} />
          <SummaryRow label="Business Location" value={values.business_location} />
          <SummaryRow label="Register" value={values.register_name} />
          <SummaryRow
            label="Cashier"
            value={cashiers.find((item) => item.value === values.cashier_user)?.label ?? values.cashier_user}
          />
          <SummaryRow label="Primary Currency" value={values.primary_currency} />
          <SummaryRow label="Exchange Rate" value={formatNumber(values.exchange_rate)} />
          <SummaryRow label="Default Customer" value="Walk-In Customer" />
          <SummaryRow label="Product Search Mode" value={values.product_search_mode} />
          <SummaryRow label="Default Product Panel" value={values.default_product_panel} />
          <SummaryRow label="Default Payment" value={values.default_payment_method} />
        </CardContent>
      </Card>

      <Field>
        <FieldLabel htmlFor="setup_notes">Setup Notes</FieldLabel>
        <Textarea
          id="setup_notes"
          rows={4}
          placeholder="Optional note for this POS register setup..."
          {...register("setup_notes")}
        />
      </Field>
    </FieldGroup>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";

  return new Intl.NumberFormat("en-US").format(value);
}
