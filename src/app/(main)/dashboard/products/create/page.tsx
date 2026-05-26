"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }).max(100),
  sku: z.string().min(2, { message: "SKU must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  compareAtPrice: z.number().positive().optional().or(z.literal(0)),
  stock: z.number().nonnegative({ message: "Stock cannot be negative." }).int(),
  category: z.string().min(1, { message: "Please select a category." }),
  status: z.string().min(1, { message: "Please select a status." }),
});

type FormValues = z.infer<typeof formSchema>;

type VariationOption = {
  name: string;
  values: string[];
};

type Variation = {
  id: string;
  options: Record<string, string>;
  sku: string;
  price: number;
  stock: number;
};

const variationTypes = [
  { value: "Color", label: "Color" },
  { value: "Size", label: "Size" },
  { value: "Material", label: "Material" },
];

const commonValues: Record<string, string[]> = {
  Color: ["Black", "White", "Red", "Blue", "Green", "Gray", "Navy", "Brown"],
  Size: ["XS", "S", "M", "L", "XL", "XXL"],
  Material: ["Cotton", "Polyester", "Leather", "Metal", "Wood", "Plastic"],
};

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [_thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [_mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [_mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [variationOptions, setVariationOptions] = useState<VariationOption[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [newOptionType, setNewOptionType] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: 0,
      compareAtPrice: 0,
      stock: 0,
      category: "",
      status: "in-stock",
    },
  });

  const generateVariations = () => {
    if (variationOptions.length === 0) return;

    const combinations: Record<string, string>[] = [{}];
    for (const option of variationOptions) {
      const newCombinations: Record<string, string>[] = [];
      for (const combo of combinations) {
        for (const value of option.values) {
          newCombinations.push({ ...combo, [option.name]: value });
        }
      }
      combinations.length = 0;
      combinations.push(...newCombinations);
    }

    const baseSku = form.getValues("sku") || "PROD";
    const basePrice = form.getValues("price") || 0;
    const baseStock = Math.floor((form.getValues("stock") || 0) / combinations.length);

    const newVariations: Variation[] = combinations.map((combo, index) => {
      const suffix = Object.values(combo).join("-");
      return {
        id: `var-${index}`,
        options: combo,
        sku: suffix ? `${baseSku}-${suffix}` : baseSku,
        price: basePrice,
        stock: baseStock,
      };
    });

    setVariations(newVariations);
  };

  const addVariationType = () => {
    if (!newOptionType || variationOptions.some((o) => o.name === newOptionType)) return;
    setVariationOptions([...variationOptions, { name: newOptionType, values: [] }]);
    setNewOptionType("");
  };

  const addVariationValue = (optionName: string) => {
    if (!newOptionValue) return;
    setVariationOptions(
      variationOptions.map((option) =>
        option.name === optionName && !option.values.includes(newOptionValue)
          ? { ...option, values: [...option.values, newOptionValue] }
          : option,
      ),
    );
    setNewOptionValue("");
  };

  const removeVariationValue = (optionName: string, value: string) => {
    setVariationOptions(
      variationOptions.map((option) =>
        option.name === optionName ? { ...option, values: option.values.filter((v) => v !== value) } : option,
      ),
    );
  };

  const removeVariationType = (optionName: string) => {
    setVariationOptions(variationOptions.filter((o) => o.name !== optionName));
    setVariations([]);
  };

  const updateVariation = (id: string, field: keyof Variation, value: string | number) => {
    setVariations(variations.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  const onSubmit = async (data: FormValues) => {
    if (data.compareAtPrice && data.compareAtPrice > 0 && data.compareAtPrice <= data.price) {
      form.setError("compareAtPrice", { type: "manual", message: "Original price must be greater than sale price." });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast.success("Product created successfully");
    router.push("/dashboard/products");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Create Product</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
      </div>

      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup className="gap-6">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1.5">
                        <FieldLabel htmlFor="prod-name">Product Name</FieldLabel>
                        <Input
                          {...field}
                          id="prod-name"
                          placeholder="e.g. MacBook Pro 16 inch"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>The name displayed in your store.</FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="sku"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1.5">
                        <FieldLabel htmlFor="prod-sku">SKU</FieldLabel>
                        <Input
                          {...field}
                          id="prod-sku"
                          placeholder="e.g. MBP-16-2024"
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          aria-invalid={fieldState.invalid}
                          className="font-mono"
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>Unique identifier for inventory tracking.</FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1.5">
                        <FieldLabel htmlFor="prod-desc">Description</FieldLabel>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Describe the product, features, and specifications..."
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>Provide a clear product description.</FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup className="gap-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name="price"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1.5">
                          <FieldLabel htmlFor="prod-price">Price ($)</FieldLabel>
                          <Input
                            id="prod-price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            aria-invalid={fieldState.invalid}
                            className="pl-7"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              field.onChange(Number.isNaN(val) ? 0 : val);
                            }}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="compareAtPrice"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1.5">
                          <FieldLabel htmlFor="prod-compare-price">Compare at Price ($)</FieldLabel>
                          <Input
                            id="prod-compare-price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            aria-invalid={fieldState.invalid}
                            className="pl-7"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              field.onChange(Number.isNaN(val) ? 0 : val);
                            }}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    control={form.control}
                    name="stock"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1.5">
                        <FieldLabel htmlFor="prod-stock">Stock Quantity</FieldLabel>
                        <Input
                          id="prod-stock"
                          type="number"
                          placeholder="0"
                          aria-invalid={fieldState.invalid}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            field.onChange(Number.isNaN(val) ? 0 : val);
                          }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Variation options:</span>
                  </div>

                  {variationOptions.map((option) => {
                    return (
                      <div key={option.name} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{option.name}</span>
                            <Badge variant="secondary">{option.values.length} values</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeVariationType(option.name)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => (
                            <Badge key={value} variant="outline" className="gap-1">
                              {value}
                              <button
                                type="button"
                                onClick={() => removeVariationValue(option.name, value)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Select
                            value={newOptionValue}
                            onValueChange={(val) => {
                              setNewOptionValue(val);
                              addVariationValue(option.name);
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Add value..." />
                            </SelectTrigger>
                            <SelectContent>
                              {commonValues[option.name]
                                ?.filter((v) => !option.values.includes(v))
                                .map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Custom value"
                            value={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addVariationValue(option.name);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addVariationValue(option.name)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  <Select value={newOptionType} onValueChange={setNewOptionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add variation type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {variationTypes
                        .filter((t) => !variationOptions.some((o) => o.name === t.value))
                        .map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={addVariationType}
                    disabled={!newOptionType}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variation Type
                  </Button>
                </div>

                {variationOptions.length > 0 && variationOptions.every((o) => o.values.length > 0) && (
                  <>
                    <Separator />
                    <Button type="button" variant="secondary" className="w-full" onClick={generateVariations}>
                      Generate {variations.length > 0 ? `${variations.length} Variations` : "Variations"}
                    </Button>
                  </>
                )}

                {variations.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Generated Variations</span>
                      <Badge variant="secondary">{variations.length} variants</Badge>
                    </div>

                    <div className="space-y-2">
                      {variations.map((variation) => (
                        <div key={variation.id} className="space-y-3 rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(variation.options).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeVariation(variation.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-muted-foreground text-xs">SKU</label>
                              <Input
                                value={variation.sku}
                                onChange={(e) => updateVariation(variation.id, "sku", e.target.value)}
                                className="mt-1 h-8 font-mono text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-muted-foreground text-xs">Price</label>
                              <Input
                                type="number"
                                value={variation.price}
                                onChange={(e) =>
                                  updateVariation(variation.id, "price", parseFloat(e.target.value) || 0)
                                }
                                className="mt-1 h-8 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-muted-foreground text-xs">Stock</label>
                              <Input
                                type="number"
                                value={variation.stock}
                                onChange={(e) =>
                                  updateVariation(variation.id, "stock", parseInt(e.target.value, 10) || 0)
                                }
                                className="mt-1 h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  maxFiles={1}
                  onFilesChange={(files) => {
                    if (files.length > 0) {
                      setThumbnailFile(files[0]);
                      setThumbnailPreview(URL.createObjectURL(files[0]));
                    } else {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }
                  }}
                />
                <p className="mt-2 text-muted-foreground text-xs">Main product image shown in listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  maxFiles={10}
                  onFilesChange={(files) => {
                    setMediaFiles(files);
                    setMediaPreviews(files.map((f) => URL.createObjectURL(f)));
                  }}
                />
                <p className="mt-2 text-muted-foreground text-xs">Additional product images (up to 10)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup className="gap-6">
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1.5">
                        <FieldLabel htmlFor="prod-category">Category</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="prod-category" aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Footwear">Footwear</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                            <SelectItem value="Fitness">Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-1.5">
                        <FieldLabel htmlFor="prod-status">Status</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="prod-status" aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
