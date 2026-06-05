"use client";

import { useCallback, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { PageHeader } from "@/components/page-header";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Agent = {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  commissionPercentage: number;
};

const mockAgents: Agent[] = [
  {
    id: "agent-1",
    prefix: "Mr",
    firstName: "Sokha",
    lastName: "Meas",
    email: "sokha.meas@acleda.com.kh",
    contactNumber: "+855 12 345 678",
    address: "#45, Street 240, Phnom Penh",
    commissionPercentage: 5.0,
  },
  {
    id: "agent-2",
    prefix: "Mrs",
    firstName: "Dara",
    lastName: "Chan",
    email: "dara.chan@acleda.com.kh",
    contactNumber: "+855 97 654 321",
    address: "#12, Russian Blvd, Siem Reap",
    commissionPercentage: 7.5,
  },
  {
    id: "agent-3",
    prefix: "Miss",
    firstName: "Bopha",
    lastName: "Kem",
    email: "bopha.kem@acleda.com.kh",
    contactNumber: "+855 77 888 999",
    address: "#78, Monivong Blvd, Battambang",
    commissionPercentage: 4.25,
  },
  {
    id: "agent-4",
    prefix: "Mr",
    firstName: "Vicheka",
    lastName: "Nop",
    email: "vicheka.nop@acleda.com.kh",
    contactNumber: "+855 88 111 222",
    address: "#23, Street 63, Phnom Penh",
    commissionPercentage: 6.0,
  },
  {
    id: "agent-5",
    prefix: "Mr",
    firstName: "Ratanak",
    lastName: "Seng",
    email: "ratanak.seng@acleda.com.kh",
    contactNumber: "+855 10 555 444",
    address: "#56, National Road 4, Kampong Speu",
    commissionPercentage: 3.75,
  },
  {
    id: "agent-6",
    prefix: "Mrs",
    firstName: "Channary",
    lastName: "Ly",
    email: "channary.ly@acleda.com.kh",
    contactNumber: "+855 96 333 777",
    address: "#89, Street 371, Phnom Penh",
    commissionPercentage: 8.0,
  },
  {
    id: "agent-7",
    prefix: "Miss",
    firstName: "Pisey",
    lastName: "Hun",
    email: "pisey.hun@acleda.com.kh",
    contactNumber: "+855 68 222 111",
    address: "#34, Sivatha Blvd, Siem Reap",
    commissionPercentage: 5.5,
  },
  {
    id: "agent-8",
    prefix: "Mr",
    firstName: "Kunthea",
    lastName: "Touch",
    email: "kunthea.touch@acleda.com.kh",
    contactNumber: "+855 76 999 888",
    address: "#101, Street 271, Phnom Penh",
    commissionPercentage: 4.0,
  },
  {
    id: "agent-9",
    prefix: "Mr",
    firstName: "Sambath",
    lastName: "Ros",
    email: "sambath.ros@acleda.com.kh",
    contactNumber: "+855 11 444 555",
    address: "#67, Street 172, Phnom Penh",
    commissionPercentage: 6.25,
  },
  {
    id: "agent-10",
    prefix: "Mrs",
    firstName: "Neary",
    lastName: "Mao",
    email: "neary.mao@acleda.com.kh",
    contactNumber: "+855 93 777 666",
    address: "#42, Ekareach St, Sihanoukville",
    commissionPercentage: 7.0,
  },
  {
    id: "agent-11",
    prefix: "Mr",
    firstName: "Thavorn",
    lastName: "Keo",
    email: "thavorn.keo@acleda.com.kh",
    contactNumber: "+855 85 888 333",
    address: "#15, Street 598, Phnom Penh",
    commissionPercentage: 3.5,
  },
  {
    id: "agent-12",
    prefix: "Miss",
    firstName: "Sreypich",
    lastName: "Ouk",
    email: "sreypich.ouk@acleda.com.kh",
    contactNumber: "+855 70 111 999",
    address: "#88, Street 214, Phnom Penh",
    commissionPercentage: 9.0,
  },
];

const formSchema = z.object({
  prefix: z.enum(["Mr", "Mrs", "Miss"]),
  firstName: z.string().min(1, "First name is required.").max(50, "First name must be at most 50 characters."),
  lastName: z.string().max(50, "Last name must be at most 50 characters").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address."),
  contactNumber: z
    .string()
    .min(5, "Contact number must be at least 5 characters.")
    .max(20, "Contact number must be at most 20 characters."),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters.")
    .max(200, "Address must be at most 200 characters."),
  commissionPercentage: z
    .string()
    .min(1, "Commission percentage is required.")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Percentage must be a number between 0 and 100.",
    }),
});

export default function SalesCommissionAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "firstName", desc: false }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      address: "",
      commissionPercentage: "",
    },
  });

  const filteredData = useMemo(() => {
    return agents.filter((agent) => {
      const query = globalFilter.toLowerCase();
      const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase();
      return (
        fullName.includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.contactNumber.toLowerCase().includes(query) ||
        agent.address.toLowerCase().includes(query)
      );
    });
  }, [agents, globalFilter]);

  const handleEditAgent = useCallback(
    (agent: Agent) => {
      setEditingAgent(agent);
      form.reset({
        prefix: agent.prefix as "Mr" | "Mrs" | "Miss",
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        contactNumber: agent.contactNumber,
        address: agent.address,
        commissionPercentage: agent.commissionPercentage.toString(),
      });
      setIsDialogOpen(true);
    },
    [form],
  );

  const handleDeleteAgent = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    toast.success("Agent deleted successfully.");
  }, []);

  const handleLoadMockData = () => {
    setAgents(mockAgents);
    toast.success("Loaded mock agents data.");
  };

  const handleClearTable = () => {
    setAgents([]);
    toast.info("Table cleared.");
  };

  const columns = useMemo<ColumnDef<Agent>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
        cell: ({ row }) => (
          <span className="font-medium text-sm">
            {row.original.prefix} {row.original.firstName} {row.original.lastName}
          </span>
        ),
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: "email",
        id: "email",
        header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.email}</span>,
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "contactNumber",
        id: "contactNumber",
        header: ({ column }) => <DataGridColumnHeader title="Contact Number" column={column} />,
        cell: ({ row }) => <span className="text-sm">{row.original.contactNumber}</span>,
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "address",
        id: "address",
        header: ({ column }) => <DataGridColumnHeader title="Address" column={column} />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.address}</span>,
        size: 240,
        enableSorting: true,
      },
      {
        accessorKey: "commissionPercentage",
        id: "commissionPercentage",
        header: ({ column }) => <DataGridColumnHeader title="Commission (%)" column={column} />,
        cell: ({ row }) => (
          <span className="font-semibold text-sm">{row.original.commissionPercentage.toFixed(2)}%</span>
        ),
        size: 140,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem onClick={() => handleEditAgent(row.original)}>
                <Pencil />
                Edit Agent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-400" onClick={() => handleDeleteAgent(row.original.id)}>
                <Trash2 />
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleEditAgent, handleDeleteAgent],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    getRowId: (row: Agent) => row.id,
    state: {
      pagination,
      sorting,
      globalFilter,
      rowSelection,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const percentage = Number.parseFloat(data.commissionPercentage);

    if (editingAgent) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgent.id
            ? {
                ...a,
                prefix: data.prefix,
                firstName: data.firstName,
                lastName: data.lastName ?? "",
                email: data.email,
                contactNumber: data.contactNumber,
                address: data.address,
                commissionPercentage: percentage,
              }
            : a,
        ),
      );
      toast.success("Agent details updated.");
    } else {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        prefix: data.prefix,
        firstName: data.firstName,
        lastName: data.lastName ?? "",
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address,
        commissionPercentage: percentage,
      };
      setAgents((prev) => [...prev, newAgent]);
      toast.success("New agent registered.");
    }

    setIsDialogOpen(false);
    setEditingAgent(null);
  };

  const handleOpenAddDialog = () => {
    setEditingAgent(null);
    form.reset({
      prefix: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      address: "",
      commissionPercentage: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader title="Commission Agents" subtitle={formattedDate} />

        <div className="flex items-center gap-2">
          {agents.length === 0 ? (
            <Button variant="outline" onClick={handleLoadMockData}>
              <RefreshCw />
              Load Mock Agents
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClearTable}>
              <Trash2 className="text-destructive" />
              Clear Table
            </Button>
          )}
          <Button onClick={handleOpenAddDialog}>
            <Plus />
            Add Agent
          </Button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Data Grid Table */}
      <DataGrid table={table} recordCount={filteredData.length} emptyMessage="No data available in table">
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>

      {/* Add / Edit Agent Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAgent ? "Edit Agent" : "Add Sales Agent"}</DialogTitle>
            <DialogDescription>
              {editingAgent ? "Update the agent's registration details." : "Register a new sales commission agent."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              {/* Prefix */}
              <Controller
                name="prefix"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agent-prefix">Prefix</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="agent-prefix">
                        <SelectValue placeholder="Select prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Miss">Miss</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="agent-first-name">
                        First Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="agent-first-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="agent-last-name">Last Name</FieldLabel>
                      <Input
                        {...field}
                        id="agent-last-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agent-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="agent-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. john@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Contact Number */}
              <Controller
                name="contactNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agent-contact">Contact Number</FieldLabel>
                    <Input
                      {...field}
                      id="agent-contact"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. +855 12 345 678"
                      autoComplete="tel"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Address */}
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agent-address">Address</FieldLabel>
                    <Textarea
                      {...field}
                      id="agent-address"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. #45, Street 240, Phnom Penh"
                      className="min-h-[80px] resize-none"
                      autoComplete="street-address"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Commission Percentage */}
              <Controller
                name="commissionPercentage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agent-commission">
                      Sales Commission Percentage (%) <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="agent-commission"
                        aria-invalid={fieldState.invalid}
                        placeholder="5.00"
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>%</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{editingAgent ? "Save Changes" : "Register Agent"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
