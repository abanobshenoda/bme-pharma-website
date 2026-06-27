"use client";

import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  Loader2,
  Search,
  Star,
  X,
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
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";

const EMPTY_FORM: ProductInput = {
  english_name: "",
  arabic_name: "",
  price: 0,
  discount: 0,
  image: "",
  images: [],
  arabic_description: "",
  english_description: "",
  sku: "",
  stock: 0,
  rating: 0,
  reviews: 0,
  isFeatured: false,
  categoryId: 0,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<
    (Product & { category: Category })[]
  >([]);
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
        setProducts(prodRes.data as (Product & { category: Category })[]);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !initialLoadDone.current) {
          setForm((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
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
      setProducts(prodRes.data as (Product & { category: Category })[]);
    }
    if (catRes.success && catRes.data) {
      setCategories(catRes.data);
    }
    setIsLoading(false);
  };

  const handleEdit = (product: Product & { category: Category }) => {
    setEditingId(product.id);
    setForm({
      english_name: product.english_name,
      arabic_name: product.arabic_name || "",
      price: product.price || 0,
      currency: product.currency || "USD",
      discount: product.discount || 0,
      image: product.image || "",
      images: product.images || [],
      arabic_description: product.arabic_description || "",
      english_description: product.english_description || "",
      sku: product.sku || "",
      stock: product.stock || 0,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isFeatured: product.isFeatured || false,
      categoryId: product.categoryId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      categoryId: categories.length > 0 ? categories[0].id : 0,
    });
  };

  const handleSubmit = async () => {
    if (!form.english_name || !form.categoryId) {
      toast.error("Please fill in English name and select a category");
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              </div>
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
            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={form.categoryId.toString()}
                onValueChange={(val) =>
                  setForm({ ...form, categoryId: parseInt(val) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.english_name} / {cat.arabic_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Main Image */}
            <div className="space-y-2">
              <Label>Main Image</Label>
              <CloudinaryUploadWidget
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
              <CloudinaryUploadWidget
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
              <Textarea
                value={form.english_description || ""}
                onChange={(e) =>
                  setForm({ ...form, english_description: e.target.value })
                }
                rows={3}
                placeholder="Product description..."
              />
            </div>
            <div className="space-y-2">
              <Label>Arabic Description</Label>
              <Textarea
                value={form.arabic_description || ""}
                onChange={(e) =>
                  setForm({ ...form, arabic_description: e.target.value })
                }
                dir="rtl"
                rows={3}
                placeholder="وصف المنتج..."
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
                    <p className="text-[10px] text-muted-foreground uppercase">
                      {product.category.english_name}
                    </p>
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
