"use client";

import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  Loader2,
  Search,
  Star,
  X,
  Tags,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/actions/store-actions";
import { getCategories } from "@/actions/category-actions";
import type { Product, Category } from "@/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import CloudinaryMediaPicker from "@/components/cloudinary-media-picker";
import RichTextEditor from "@/components/ui/rich-text-editor";

// Product with many-to-many categories
type ProductWithCategories = Omit<Product, "categoryId"> & {
  categories: Category[];
};

const EMPTY_FORM: ProductInput = {
  english_name: "",
  arabic_name: "",
  price: 0,
  discountType: "PERCENTAGE",
  discount: 0,
  buyXQuantity: null,
  getYQuantity: null,
  image: "",
  images: [],
  arabic_description: "",
  english_description: "",
  sku: "",
  stock: 0,
  rating: 0,
  reviews: 0,
  isFeatured: false,
  categoryIds: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInput>({ ...EMPTY_FORM });

  const initialLoadDone = useRef(false);

  useEffect(() => {
    let mounted = true;
    const initData = async () => {
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      if (!mounted) return;

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data as unknown as ProductWithCategories[]);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (!initialLoadDone.current) {
          initialLoadDone.current = true;
        }
      }
      setIsLoading(false);
    };

    initData();
    return () => {
      mounted = false;
    };
  }, []);

  const loadData = async () => {
    const [prodRes, catRes] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data as unknown as ProductWithCategories[]);
    }
    if (catRes.success && catRes.data) {
      setCategories(catRes.data);
    }
    setIsLoading(false);
  };

  const handleEdit = (product: ProductWithCategories) => {
    setEditingId(product.id);
    setForm({
      english_name: product.english_name,
      arabic_name: product.arabic_name || "",
      price: product.price || 0,
      currency: product.currency || "USD",
      discountType: (product as any).discountType || "PERCENTAGE",
      discount: product.discount || 0,
      buyXQuantity: (product as any).buyXQuantity ?? null,
      getYQuantity: (product as any).getYQuantity ?? null,
      image: product.image || "",
      images: product.images || [],
      arabic_description: product.arabic_description || "",
      english_description: product.english_description || "",
      sku: product.sku || "",
      stock: product.stock || 0,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isFeatured: product.isFeatured || false,
      categoryIds: product.categories.map((c) => c.id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleSubmit = async () => {
    if (!form.english_name) {
      toast.error("Please fill in the English name");
      return;
    }
    if (form.categoryIds.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    setIsSaving(true);
    const res = editingId
      ? await updateProduct(editingId, form)
      : await createProduct(form);

    if (res.success) {
      toast.success(editingId ? "Product updated" : "Product created");
      handleCancel();
      loadData();
    } else {
      toast.error("Failed to save product");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Product deleted");
      setProducts(products.filter((p) => p.id !== id));
    } else {
      toast.error("Failed to delete product");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // Toggle a category on/off in the multi-select list
  const toggleCategory = (catId: number) => {
    setForm((prev) => {
      const already = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: already
          ? prev.categoryIds.filter((id) => id !== catId)
          : [...prev.categoryIds, catId],
      };
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.arabic_name && p.arabic_name.includes(searchQuery)),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Product Library</h3>
        <p className="text-sm text-muted-foreground">
          Manage your products, prices, images, and details.
        </p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form Section ── */}
        <Card className="lg:col-span-1 h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* English Name */}
            <div className="space-y-2">
              <Label>English Name *</Label>
              <Input
                value={form.english_name}
                onChange={(e) =>
                  setForm({ ...form, english_name: e.target.value })
                }
                placeholder="Product Name"
              />
            </div>
            {/* Arabic Name */}
            <div className="space-y-2">
              <Label>Arabic Name</Label>
              <Input
                value={form.arabic_name || ""}
                onChange={(e) =>
                  setForm({ ...form, arabic_name: e.target.value })
                }
                dir="rtl"
                placeholder="اسم المنتج"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency || "USD"}
                  onValueChange={(val) => setForm({ ...form, currency: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EGP">EGP (E£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Discount Section */}
            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <Label className="font-semibold text-sm">Discount / Offer</Label>
              <Select
                value={form.discountType || "PERCENTAGE"}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    discountType: val,
                    discount: 0,
                    buyXQuantity: null,
                    getYQuantity: null,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage Discount (%)</SelectItem>
                  <SelectItem value="BUY_X_GET_Y">Buy X Get Y Free</SelectItem>
                </SelectContent>
              </Select>

              {(form.discountType === "PERCENTAGE" || !form.discountType) && (
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={form.discount || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    min={0}
                    max={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g. 20 = 20% off the price
                  </p>
                </div>
              )}

              {form.discountType === "BUY_X_GET_Y" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Buy X (Quantity)</Label>
                    <Input
                      type="number"
                      value={form.buyXQuantity ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          buyXQuantity: parseInt(e.target.value) || null,
                        })
                      }
                      placeholder="e.g. 2"
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Get Y Free</Label>
                    <Input
                      type="number"
                      value={form.getYQuantity ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          getYQuantity: parseInt(e.target.value) || null,
                        })
                      }
                      placeholder="e.g. 1"
                      min={1}
                    />
                  </div>
                  <p className="col-span-2 text-xs text-muted-foreground">
                    e.g. Buy 2 Get 1 Free → customer buys 5, gets 2 free (floor(5/2)×1)
                  </p>
                </div>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={form.sku || ""}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="PRD-001"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={form.stock ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <Input
                  type="number"
                  value={form.rating ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rating: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Reviews</Label>
                <Input
                  type="number"
                  value={form.reviews ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reviews: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  min={0}
                />
              </div>
            </div>

            {/* ── Categories (Multi-select) ── */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Tags className="w-3.5 h-3.5" />
                Categories *
                <span className="text-xs text-muted-foreground font-normal">
                  (اختر أكتر من تخصص)
                </span>
              </Label>

              {/* Selected badges */}
              {form.categoryIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 rounded-md border">
                  {form.categoryIds.map((id) => {
                    const cat = categories.find((c) => c.id === id);
                    if (!cat) return null;
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs pr-1"
                      >
                        {cat.english_name}
                        <button
                          type="button"
                          onClick={() => toggleCategory(id)}
                          className="ml-1 hover:text-destructive transition-colors"
                          aria-label={`Remove ${cat.english_name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Checkbox list */}
              <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3">
                    No categories found. Create one first.
                  </p>
                ) : (
                  categories.map((cat) => {
                    const isChecked = form.categoryIds.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleCategory(cat.id)}
                          id={`cat-${cat.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">
                            {cat.english_name}
                          </p>
                          {cat.arabic_name && (
                            <p
                              className="text-xs text-muted-foreground leading-tight"
                              dir="rtl"
                            >
                              {cat.arabic_name}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
              {form.categoryIds.length === 0 && (
                <p className="text-xs text-destructive">
                  Please select at least one category
                </p>
              )}
            </div>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>Main Image</Label>
              <CloudinaryMediaPicker
                value={form.image || ""}
                onUpload={(url) => setForm((prev) => ({ ...prev, image: url }))}
                onRemove={() => setForm((prev) => ({ ...prev, image: "" }))}
              />
            </div>
            {/* Gallery Images */}
            <div className="space-y-2">
              <Label>Gallery Images</Label>
              {(form.images || []).length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {(form.images || []).map((img, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove gallery image ${idx + 1}`}
                        tabIndex={0}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <CloudinaryMediaPicker
                value=""
                onUpload={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), url],
                  }))
                }
                onRemove={() => {}}
              />
            </div>
            {/* Descriptions */}
            <div className="space-y-2">
              <Label>English Description</Label>
              <RichTextEditor
                value={form.english_description || ""}
                onChange={(val) =>
                  setForm({ ...form, english_description: val })
                }
                placeholder="Product description..."
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>Arabic Description</Label>
              <RichTextEditor
                value={form.arabic_description || ""}
                onChange={(val) =>
                  setForm({ ...form, arabic_description: val })
                }
                placeholder="وصف المنتج..."
                dir="rtl"
              />
            </div>
            {/* Featured Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={form.isFeatured}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isFeatured: !!checked })
                }
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>
            {/* Submit / Cancel */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Edit2 className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {editingId ? "Update Product" : "Create Product"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Product List ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <Card className="col-span-full py-12 text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No products found.</p>
              </Card>
            ) : (
              filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-video">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.english_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-8 w-8 opacity-20" />
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        FEATURED
                      </div>
                    )}
                    {(product.discount ?? 0) > 0 && (
                      <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[10px] font-bold">
                        -{product.discount}%
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" onClick={() => handleEdit(product)}>
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm truncate flex-1">
                        {product.english_name}
                      </h4>
                      <span className="text-sm font-bold text-primary ml-2">
                        ${product.price?.toFixed(2)}
                      </span>
                    </div>
                    {/* Show all categories as badges */}
                    <div className="flex flex-wrap gap-1 mb-1">
                      {product.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="text-[9px] uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium"
                        >
                          {cat.english_name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      {product.sku && <span>SKU: {product.sku}</span>}
                      <span>Stock: {product.stock ?? 0}</span>
                      {(product.rating ?? 0) > 0 && (
                        <span>
                          ★ {product.rating?.toFixed(1)} ({product.reviews})
                        </span>
                      )}
                    </div>
                    {product.arabic_name && (
                      <p
                        className="text-[10px] text-muted-foreground text-right mt-1"
                        dir="rtl"
                      >
                        {product.arabic_name}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
