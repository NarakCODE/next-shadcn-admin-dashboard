"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  CircleHelp,
  CreditCard,
  IdCard,
  Link2,
  Lock,
  MapPin,
  Percent,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function RequiredIndicator() {
  return <span className="ml-0.5 text-destructive">*</span>;
}

function HelpTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            <CircleHelp className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FormSection({
  id,
  title,
  description,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
          <CardTitle className="font-semibold text-lg tracking-tight">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <FieldGroup>{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

function FieldRow({
  label,
  required,
  description,
  tooltip,
  children,
}: {
  label: string;
  required?: boolean;
  description?: string;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <Field className="space-y-2">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <FieldLabel className="font-medium text-foreground text-sm">{label}</FieldLabel>
          {required && <RequiredIndicator />}
          {tooltip && <HelpTooltip content={tooltip} />}
        </div>
        {description && <FieldDescription className="text-muted-foreground text-xs">{description}</FieldDescription>}
      </div>
      {children}
    </Field>
  );
}

function CheckboxField({
  label,
  description,
  defaultChecked,
  tooltip,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  tooltip?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);

  return (
    <div className="flex items-start space-x-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40">
      <Checkbox id={label} checked={checked} onCheckedChange={(val) => setChecked(val as boolean)} className="mt-0.5" />
      <div className="grid gap-1 leading-none">
        <div className="flex items-center gap-1.5">
          <Label htmlFor={label} className="cursor-pointer font-medium text-sm">
            {label}
          </Label>
          {tooltip && <HelpTooltip content={tooltip} />}
        </div>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>
    </div>
  );
}

export default function CreateUserPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/users")}
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Users
          </Button>
        </div>
        <PageHeader
          title="Create User"
          subtitle="Add a new staff member or user profile to your POS system. Required fields are marked with an asterisk."
        />
      </div>

      <Separator />

      {/* Pure Stacked Form Sections */}
      <div className="flex flex-col gap-8">
        {/* Basic Information */}
        <FormSection
          id="basic-info"
          title="Basic Information"
          description="Personal details and name prefix for the user."
          icon={User}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldRow label="Prefix">
              <Select defaultValue="mr">
                <SelectTrigger>
                  <SelectValue placeholder="Select prefix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="mr">Mr</SelectItem>
                    <SelectItem value="mrs">Mrs</SelectItem>
                    <SelectItem value="miss">Miss</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="First Name" required>
              <Input placeholder="Enter first name" />
            </FieldRow>
            <FieldRow label="Last Name">
              <Input placeholder="Enter last name" />
            </FieldRow>
          </div>
        </FormSection>

        {/* Login & Access */}
        <FormSection
          id="login-access"
          title="Login & Access"
          description="Configure login credentials and access permissions."
          icon={Lock}
        >
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow label="Email" required>
              <Input type="email" placeholder="user@example.com" />
            </FieldRow>
            <FieldRow label="Username">
              <Input placeholder="Leave blank to auto generate username" />
            </FieldRow>
            <FieldRow label="Password" required>
              <Input type="password" placeholder="Enter password" />
            </FieldRow>
            <FieldRow label="Confirm Password" required>
              <Input type="password" placeholder="Confirm password" />
            </FieldRow>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CheckboxField
              label="Is active?"
              description="User can log in and access the system."
              defaultChecked
              tooltip="When disabled, the user cannot log in or perform any actions in the system."
            />
            <CheckboxField
              label="Enable service staff pin"
              description="Allow user to authenticate with a PIN code."
              tooltip="Requires the user to enter a numeric PIN before processing sales or accessing restricted features."
            />
            <CheckboxField label="Allow login" description="Grant login access to the POS system." defaultChecked />
          </div>
        </FormSection>

        {/* Roles & Locations */}
        <FormSection
          id="roles-locations"
          title="Roles & Locations"
          description="Assign role and location access for the user."
          icon={Users}
        >
          <div className="mb-6 max-w-md">
            <FieldRow
              label="Role"
              required
              tooltip="Determines what features and data the user can access. Admins have full access; Cashiers are limited to POS operations."
            >
              <Select defaultValue="admin">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldRow>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CheckboxField
              label="All Locations"
              description="Grant access to all business locations."
              defaultChecked
              tooltip="When enabled, the user can view and manage transactions across every branch. Disable to restrict access to specific locations listed below."
            />
            <CheckboxField label="ACLEDA BANK (BL0001)" description="Grant access to this specific location." />
          </div>
        </FormSection>

        {/* Sales Settings */}
        <FormSection
          id="sales-settings"
          title="Sales Settings"
          description="Configure sales commission and discount permissions."
          icon={Percent}
        >
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow
              label="Sales Commission Percentage (%)"
              tooltip="Percentage of each sale attributed to this user that counts toward their commission."
            >
              <Input type="number" placeholder="0" min={0} max={100} />
            </FieldRow>
            <FieldRow
              label="Max Sales Discount Percent"
              tooltip="Maximum discount percentage this user can apply to a sale without requiring manager approval."
            >
              <Input type="number" placeholder="0" min={0} max={100} />
            </FieldRow>
          </div>

          <Separator className="my-4" />

          <CheckboxField
            label="Allow Selected Contacts"
            description="Restrict access to specific customer contacts only."
            tooltip="When enabled, the user can only view and interact with a predefined list of customer contacts rather than the full customer database."
          />
        </FormSection>

        {/* Personal Details */}
        <FormSection
          id="personal-details"
          title="Personal Details"
          description="Additional personal information for the user profile."
          icon={IdCard}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FieldRow label="Date of Birth">
              <Input type="date" />
            </FieldRow>
            <FieldRow label="Gender">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="Marital Status">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="unmarried">Unmarried</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="Blood Group">
              <Input placeholder="e.g. A+, B-, O+" />
            </FieldRow>
          </div>
        </FormSection>

        {/* Contact & Social Links */}
        <FormSection
          id="contact-social"
          title="Contact & Social Links"
          description="Phone numbers and social media profile links."
          icon={Link2}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FieldRow label="Mobile Number">
              <Input type="tel" placeholder="+855 XX XXX XXXX" />
            </FieldRow>
            <FieldRow label="Alternate Contact Number">
              <Input type="tel" placeholder="+855 XX XXX XXXX" />
            </FieldRow>
            <FieldRow label="Family Contact Number">
              <Input type="tel" placeholder="+855 XX XXX XXXX" />
            </FieldRow>
            <FieldRow label="Facebook Link">
              <Input type="url" placeholder="https://facebook.com/username" />
            </FieldRow>
            <FieldRow label="Twitter Link">
              <Input type="url" placeholder="https://twitter.com/username" />
            </FieldRow>
            <FieldRow label="Social Media 1">
              <Input placeholder="Platform and profile URL" />
            </FieldRow>
            <FieldRow label="Social Media 2">
              <Input placeholder="Platform and profile URL" />
            </FieldRow>
          </div>
        </FormSection>

        {/* Custom Fields */}
        <FormSection
          id="custom-fields"
          title="Custom Fields"
          description="Additional custom fields for your specific business needs."
          icon={Settings}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow label="Custom Field 1">
              <Input placeholder="Enter value" />
            </FieldRow>
            <FieldRow label="Custom Field 2">
              <Input placeholder="Enter value" />
            </FieldRow>
            <FieldRow label="Custom Field 3">
              <Input placeholder="Enter value" />
            </FieldRow>
            <FieldRow label="Custom Field 4">
              <Input placeholder="Enter value" />
            </FieldRow>
          </div>
        </FormSection>

        {/* Identity & Address */}
        <FormSection
          id="identity-address"
          title="Identity & Address"
          description="Guardian information, ID proof, and address details."
          icon={MapPin}
        >
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldRow label="Guardian Name">
              <Input placeholder="Enter guardian name" />
            </FieldRow>
            <FieldRow label="ID Proof Name">
              <Input placeholder="e.g. National ID, Passport" />
            </FieldRow>
            <FieldRow label="ID Proof Number">
              <Input placeholder="Enter ID number" />
            </FieldRow>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow label="Permanent Address">
              <Textarea placeholder="Enter permanent address" className="min-h-[100px] resize-none" />
            </FieldRow>
            <FieldRow label="Current Address">
              <Textarea placeholder="Enter current address" className="min-h-[100px] resize-none" />
            </FieldRow>
          </div>
        </FormSection>

        {/* Bank & Tax Information */}
        <FormSection
          id="bank-tax"
          title="Bank & Tax Information"
          description="Banking details and tax identification for payroll and compliance."
          icon={CreditCard}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FieldRow label="Account Holder's Name">
              <Input placeholder="Enter account holder name" />
            </FieldRow>
            <FieldRow label="Account Number">
              <Input placeholder="Enter account number" />
            </FieldRow>
            <FieldRow label="Bank Name">
              <Input placeholder="Enter bank name" />
            </FieldRow>
            <FieldRow
              label="Bank Identifier Code"
              tooltip="The SWIFT or BIC code used for international wire transfers to this account."
            >
              <Input placeholder="e.g. SWIFT/BIC code" />
            </FieldRow>
            <FieldRow label="Branch">
              <Input placeholder="Enter branch name" />
            </FieldRow>
            <FieldRow
              label="Tax Payer ID"
              tooltip="Government-issued tax identification number used for payroll and tax reporting purposes."
            >
              <Input placeholder="Enter tax payer ID" />
            </FieldRow>
          </div>
        </FormSection>
      </div>

      {/* Action Buttons Footer */}
      <div className="sticky bottom-0 -mx-6 border-t bg-background/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard/users")}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Building2 className="mr-2 size-4" />
              Save & Add Another
            </Button>
            <Button>
              <UserPlus className="mr-2 size-4" />
              Save User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
