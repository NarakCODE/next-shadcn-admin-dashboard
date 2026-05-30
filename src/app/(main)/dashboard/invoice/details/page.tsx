"use client";

import Link from "next/link";

import { ArrowLeft, Download, Mail, Printer } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const invoiceItems = [
  { id: 1, description: "Web Design Services", quantity: 1, rate: 1500.0, amount: 1500.0 },
  { id: 2, description: "Frontend Development (40 hrs)", quantity: 40, rate: 75.0, amount: 3000.0 },
  { id: 3, description: "Backend API Integration", quantity: 20, rate: 85.0, amount: 1700.0 },
  { id: 4, description: "Testing & QA", quantity: 10, rate: 60.0, amount: 600.0 },
];

export default function InvoiceDetailsPage() {
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invoice">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight">Invoice INV-001</h1>
            <p className="text-muted-foreground text-sm">View invoice details and actions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoice Details</CardTitle>
              <Badge className={statusColors.paid}>Paid</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">From</p>
                <p className="font-medium">Your Company Inc.</p>
                <p className="text-muted-foreground text-sm">123 Business Ave</p>
                <p className="text-muted-foreground text-sm">New York, NY 10001</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Bill To</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Acme Corp" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Acme Corp</p>
                    <p className="text-muted-foreground text-sm">billing@acme.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Invoice Number</p>
                <p className="font-medium font-mono">INV-001</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Issue Date</p>
                <p className="font-medium">Jan 15, 2024</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Due Date</p>
                <p className="font-medium">Feb 15, 2024</p>
              </div>
            </div>

            <Separator className="mb-6" />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-semibold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <p className="text-muted-foreground text-sm">Status</p>
                <Badge className={statusColors.paid}>Paid</Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Amount Paid</p>
                <p className="font-semibold text-green-600 text-xl">${total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Payment Date</p>
                <p className="font-medium">Feb 10, 2024</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Payment Method</p>
                <p className="font-medium">Bank Transfer</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Invoice created</p>
                <p className="text-muted-foreground text-xs">Jan 15, 2024 at 10:30 AM</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Sent to client</p>
                <p className="text-muted-foreground text-xs">Jan 15, 2024 at 11:00 AM</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Payment received</p>
                <p className="text-muted-foreground text-xs">Feb 10, 2024 at 2:45 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
