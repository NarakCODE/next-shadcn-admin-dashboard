"use client";

import type * as React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Expense title must be at least 3 characters.")
    .max(50, "Expense title must be at most 50 characters."),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number.",
    }),
  category: z.string().min(1, "Please select a category."),
  date: z.string().min(1, "Date is required."),
  notes: z.string().max(200, "Notes must be at most 200 characters.").optional().or(z.literal("")),
});

export default function CreateExpensePage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/expenses")}>
            <ArrowLeft data-icon="inline-start" />
            Back to Expenses
          </Button>
        </div>
        <PageHeader title="Add Expense" subtitle="Record a new expense in the system." />
      </div>

      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Enter the details of the transaction below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-expense-create" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expense-title">Expense Title</FieldLabel>
                    <Input
                      {...field}
                      id="expense-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Office Supplies"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expense-amount">Amount</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="expense-amount"
                        type="text"
                        placeholder="0.00"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expense-category">Category</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="expense-category" aria-invalid={fieldState.invalid} className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="housing">Housing</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="groceries">Groceries</SelectItem>
                          <SelectItem value="transportation">Transport</SelectItem>
                          <SelectItem value="leisure">Leisure</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expense-date">Date</FieldLabel>
                    <Input {...field} id="expense-date" type="date" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="expense-notes">Notes / Description</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="expense-notes"
                        placeholder="Additional details..."
                        rows={3}
                        className="min-h-16 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {(field.value || "").length}/200 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-expense-create">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
