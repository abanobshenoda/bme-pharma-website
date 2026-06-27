"use client";

import { useState, useEffect, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Search, Star, Store, StarOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  getStorePage,
  createStorePage,
  updateStorePage,
  getProducts,
  updateProduct,
} from "@/actions/store-actions";
import {
  getFeaturedProductsSection,
  createFeaturedProductsSection,
  updateFeaturedProductsSection,
} from "@/actions/featured-products-section-actions";
import type {
  Product,
  Category,
  StorePage as StorePageType,
  FeaturedProductsSection,
} from "@/generated/prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StoreContentDashboard() {
  const [activeTab, setActiveTab] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);

  // ── Featured Products Section State ──
  const [featuredSectionData, setFeaturedSectionData] =
    useState<FeaturedProductsSection | null>(null);
  const [isFeaturedSaving, setIsFeaturedSaving] = useState(false);
  const [featuredForm, setFeaturedForm] = useState({
    arabic_header: "",
    english_header: "",
    arabic_description: "",
    english_description: "",
  });
  const [products, setProducts] = useState<
    (Product & { category: Category })[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  // ── Store Page State ──
  const [storeData, setStoreData] = useState<StorePageType | null>(null);
  const [isStoreSaving, setIsStoreSaving] = useState(false);
  const [storeForm, setStoreForm] = useState({
    arabic_header: "",
    english_header: "",
    arabic_description: "",
    english_description: "",
  });

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    const [featuredRes, storeRes, prodRes] = await Promise.all([
      getFeaturedProductsSection(),
      getStorePage(),
      getProducts(),
    ]);

    if (featuredRes.success && featuredRes.data) {
      setFeaturedSectionData(featuredRes.data);
      setFeaturedForm({
        arabic_header: featuredRes.data.arabic_header || "",
        english_header: featuredRes.data.english_header || "",
        arabic_description: featuredRes.data.arabic_description || "",
        english_description: featuredRes.data.english_description || "",
      });
    }

    if (storeRes.success && storeRes.data) {
      setStoreData(storeRes.data);
      setStoreForm({
        arabic_header: storeRes.data.arabic_header || "",
        english_header: storeRes.data.english_header || "",
        arabic_description: storeRes.data.arabic_description || "",
        english_description: storeRes.data.english_description || "",
      });
    }

    if (prodRes.success && prodRes.data) {
      setProducts(prodRes.data as (Product & { category: Category })[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ── Handlers for Featured Products Section ──
  const handleSaveFeaturedSection = async () => {
    setIsFeaturedSaving(true);
    const res = featuredSectionData
      ? await updateFeaturedProductsSection(
          featuredSectionData.id,
          featuredForm,
        )
      : await createFeaturedProductsSection(featuredForm);

    if (res.success) {
      setFeaturedSectionData(res.data || null);
      toast.success("Featured section details saved");
    } else {
      toast.error("Failed to save featured section details");
    }
    setIsFeaturedSaving(false);
  };

  const handleToggleFeatured = async (
    product: Product & { category: Category },
  ) => {
    setTogglingIds((prev) => new Set(prev).add(product.id));
    const res = await updateProduct(product.id, {
      isFeatured: !product.isFeatured,
    });

    if (res.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p,
        ),
      );
      toast.success(
        product.isFeatured
          ? `"${product.english_name}" removed from featured`
          : `"${product.english_name}" added to featured`,
      );
    } else {
      toast.error("Failed to update product");
    }
    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.delete(product.id);
      return next;
    });
  };

  // ── Handlers for Store Page ──
  const handleSaveStore = async () => {
    setIsStoreSaving(true);
    const res = storeData
      ? await updateStorePage(storeData.id, storeForm)
      : await createStorePage(storeForm);

    if (res.success) {
      setStoreData(res.data || null);
      toast.success("Store page details saved");
    } else {
      toast.error("Failed to save store details");
    }
    setIsStoreSaving(false);
  };

  // ── Filtering ──
  const featuredProducts = products.filter((p) => p.isFeatured);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Store Content</h3>
          <p className="text-sm text-muted-foreground">
            Manage featured products and store page content.
          </p>
        </div>
      </div>
      <Separator />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Featured Products
          </TabsTrigger>
          <TabsTrigger value="store-page" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Store Page
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Featured Products ── */}
        <TabsContent value="featured" className="space-y-6">
          {/* Section Header/Description Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Section Header &amp; Description</CardTitle>
              <Button
                onClick={handleSaveFeaturedSection}
                disabled={isFeaturedSaving}
              >
                {isFeaturedSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>English Header</Label>
                  <Input
                    value={featuredForm.english_header}
                    onChange={(e) =>
                      setFeaturedForm({
                        ...featuredForm,
                        english_header: e.target.value,
                      })
                    }
                    placeholder="Featured Products"
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label>العنوان العربي</Label>
                  <Input
                    value={featuredForm.arabic_header}
                    onChange={(e) =>
                      setFeaturedForm({
                        ...featuredForm,
                        arabic_header: e.target.value,
                      })
                    }
                    dir="rtl"
                    placeholder="المنتجات المميزة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>English Description</Label>
                  <Textarea
                    value={featuredForm.english_description}
                    onChange={(e) =>
                      setFeaturedForm({
                        ...featuredForm,
                        english_description: e.target.value,
                      })
                    }
                    placeholder="Discover our top-rated products..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label>الوصف العربي</Label>
                  <Textarea
                    value={featuredForm.arabic_description}
                    onChange={(e) =>
                      setFeaturedForm({
                        ...featuredForm,
                        arabic_description: e.target.value,
                      })
                    }
                    dir="rtl"
                    placeholder="اكتشف منتجاتنا الأكثر تميزاً..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Featured Products Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Featured ({featuredProducts.length})
              </CardTitle>
            </CardHeader>
            {featuredProducts.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {featuredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 text-sm"
                    >
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.english_name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover w-6 h-6"
                        />
                      )}
                      <span className="font-medium">{p.english_name}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        disabled={togglingIds.has(p.id)}
                        className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${p.english_name} from featured`}
                        tabIndex={0}
                      >
                        {togglingIds.has(p.id) ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span className="text-xs">✕</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* All Products - Toggle Featured */}
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.length === 0 ? (
                  <p className="col-span-full text-center py-8 text-muted-foreground">
                    No products found.
                  </p>
                ) : (
                  filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleToggleFeatured(p)}
                      disabled={togglingIds.has(p.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full ${
                        p.isFeatured
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      aria-label={`${p.isFeatured ? "Remove" : "Add"} ${p.english_name} ${p.isFeatured ? "from" : "to"} featured`}
                      tabIndex={0}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.english_name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {p.english_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {p.category.english_name}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {togglingIds.has(p.id) ? (
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : p.isFeatured ? (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Store Page ── */}
        <TabsContent value="store-page">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Store Page Header &amp; Description</CardTitle>
              <Button onClick={handleSaveStore} disabled={isStoreSaving}>
                {isStoreSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>English Header</Label>
                  <Input
                    value={storeForm.english_header}
                    onChange={(e) =>
                      setStoreForm({
                        ...storeForm,
                        english_header: e.target.value,
                      })
                    }
                    placeholder="Our Store"
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label>العنوان العربي</Label>
                  <Input
                    value={storeForm.arabic_header}
                    onChange={(e) =>
                      setStoreForm({
                        ...storeForm,
                        arabic_header: e.target.value,
                      })
                    }
                    dir="rtl"
                    placeholder="متجرنا"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>English Description</Label>
                  <Textarea
                    value={storeForm.english_description}
                    onChange={(e) =>
                      setStoreForm({
                        ...storeForm,
                        english_description: e.target.value,
                      })
                    }
                    placeholder="Browse our wide range..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label>الوصف العربي</Label>
                  <Textarea
                    value={storeForm.arabic_description}
                    onChange={(e) =>
                      setStoreForm({
                        ...storeForm,
                        arabic_description: e.target.value,
                      })
                    }
                    dir="rtl"
                    placeholder="تصفح مجموعتنا الواسعة..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
