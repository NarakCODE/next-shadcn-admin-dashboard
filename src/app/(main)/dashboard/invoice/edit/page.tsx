"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  rate: number;
};

const initialItems: InvoiceItem[] = [
  { id: 1, description: "Web Design Services", quantity: 1, rate: 1500.0 },
  { id: 2, description: "Frontend Development (40 hrs)", quantity: 40, rate: 75.0 },
  { id: 3, description: "Backend API Integration", quantity: 20, rate: 85.0 },
  { id: 4, description: "Testing & QA", quantity: 10, rate: 60.0 },
];

export default function InvoiceEditPage() {
  const [items, setItems] = useState<InvoiceItem[]>(initialItems);
  const [clientName, setClientName] = useState("Acme Corp");
  const [clientEmail, setClientEmail] = useState("billing@acme.com");
  const [issueDate, setIssueDate] = useState("2024-01-15");
  const [dueDate, setDueDate] = useState("2024-02-15");
  const [notes, setNotes] = useState("Thank you for your business!");
  const [status, setStatus] = useState("pending");

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl leading-none tracking-tight">Edit Invoice</h1>
              <Badge className={statusColors[status]}>Pending</Badge>
            </div>
            <p className="text-muted-foreground text-sm">INV-001 - Modify invoice details</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Save Changes
          </Button>
          <Button size="sm">Update & Send</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="text-right"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value, 10) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="text-right"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button variant="outline" className="mt-4" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>

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

            <Separator className="my-6" />

            <div className="flex flex-col gap-4">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes for the client..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Client Name</Label>
                <Input
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Client Email</Label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Issue Date</Label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
