"use client";

import type React from "react";
import { useState } from "react";

import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Customer {
  value: string;
  label: string;
  phone?: string;
  email?: string;
}

interface CustomerSelectorProps {
  selectedCustomer: string;
  onCustomerChange: (value: string) => void;
  customersList: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

export function CustomerSelector({
  selectedCustomer,
  onCustomerChange,
  customersList,
  onAddCustomer,
}: CustomerSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New customer form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const activeCustomer = customersList.find((c) => c.value === selectedCustomer) || customersList[0];

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a customer name");
      return;
    }

    const newCustValue = newName.toLowerCase().replace(/\s+/g, "_");
    const newCust: Customer = {
      value: newCustValue,
      label: newName,
      phone: newPhone || undefined,
      email: newEmail || undefined,
    };

    onAddCustomer(newCust);
    onCustomerChange(newCustValue);
    setIsDialogOpen(false);

    // Reset fields
    setNewName("");
    setNewPhone("");
    setNewEmail("");

    toast.success(`Customer "${newName}" added successfully!`);
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label>Customer</Label>
        <Button variant="link" size="sm" type="button" onClick={() => setIsDialogOpen(true)}>
          <Plus />
          Add new customer
        </Button>
      </div>

      <Field>
        <Combobox
          items={customersList}
          value={activeCustomer}
          itemToStringLabel={(customer) => customer?.label ?? ""}
          itemToStringValue={(customer) => customer?.value ?? ""}
          onValueChange={(item: Customer | null) => {
            if (item) onCustomerChange(item.value);
          }}
        >
          <ComboboxInput placeholder="Select or search customer" aria-label="Select customer" className="w-full" />
          <ComboboxContent>
            <ComboboxEmpty>No customer found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  <div className="flex flex-col text-left">
                    <span>{item.label}</span>
                    {item.phone && <span className="font-mono text-[10px] text-muted-foreground">{item.phone}</span>}
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      {/* Add New Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
          <form onSubmit={handleCreateCustomer}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="size-5 text-primary" />
                Add New
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-xs">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sokha Chea"
                  className="col-span-3 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right text-xs">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 012345678"
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-xs">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. sokha@example.com"
                  className="col-span-3 text-xs"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs">
                Save Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
